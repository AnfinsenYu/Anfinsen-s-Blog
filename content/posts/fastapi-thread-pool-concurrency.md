---
title: "FastAPI 线程池并发优化实战：从 1 并发到 100 并发的解决方案"
date: 2026-06-03T18:00:00+08:00
draft: false
tags: ["FastAPI", "Python", "并发", "异步", "线程池"]
categories: ["技术实践"]
author: AnfinsenYu
showToc: true
TocOpen: true
summary: "在一个语音识别项目中遇到 FastAPI 并发瓶颈，通过 asyncio.to_thread() + Semaphore 方案，将并发能力从 1-3 提升至 100。本文详细记录问题排查、方案设计与实现过程。"
---

## 前言

在开发 语音识别+AI总结服务时，遇到了一个棘手的并发问题：FastAPI 服务在多用户同时请求时响应极慢，甚至超时。经过排查发现，问题根源在于同步阻塞的第三方 SDK 调用卡住了事件循环。

本文记录从问题发现到解决的完整过程，以及对 FastAPI 异步并发机制的深入理解。

---

## 问题现象

### 1. 领导反馈

> "多个人同时用的时候，服务响应特别慢，有时候直接超时了。"

### 2. 代码现状

```python
# config.py
MAX_CONCURRENCY = 50  # 定义了，但从未使用

# api/asr.py
@app.post("/asr/")
async def asr_endpoint(file: UploadFile):
    # 直接调用 DashScope SDK（同步阻塞）
    result = dashscope_asr(file)  # 卡住事件循环！
    return result
```

### 3. 测试验证

```bash
# 模拟 10 个并发请求
for i in {1..10}; do
  curl -X POST http://localhost:8000/asr/ -F "file=@test.wav" &
done
wait
```

**结果**：
- 第 1 个请求：正常返回（~19 秒）
- 第 2-10 个请求：排队等待，总耗时 190 秒
- 实际并发能力：**1-3 个请求**

---

## 问题分析

### 1. 什么是事件循环？

FastAPI 基于 asyncio，使用**单线程事件循环**处理请求：

```
┌─────────────────────────────────────────────────────────────┐
│                    事件循环（单线程）                          │
│                                                             │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│   │ 请求 1   │→  │ 请求 2   │→  │ 请求 3   │→  │ 请求 4   │    │
│   │ 处理中   │   │ 等待...  │   │ 等待...  │   │ 等待...  │    │
│   └─────────┘   └─────────┘   └─────────┘   └─────────┘    │
│                                                             │
│   关键：同一时刻只能处理一个请求的 I/O 操作                     │
└─────────────────────────────────────────────────────────────┘
```

### 2. 同步阻塞的危害

DashScope SDK 的 ASR 调用是**同步阻塞**的：

```python
def dashscope_asr(audio_file):
    # 这个调用会阻塞 19 秒
    # 期间事件循环完全卡住，无法处理任何其他请求
    response = dashscope.MultiModalConversation.call(...)
    return response
```

**时序图**：
```
事件循环:  [处理请求1]████████████████████████████[处理请求2]████████████████████████████
               ↑ 同步阻塞 19 秒                      ↑ 同步阻塞 19 秒
           请求2、3、4...全部排队等待
```

### 3. 为什么 asyncio 无法解决？

很多人会问：FastAPI 不是异步的吗？为什么还会阻塞？

**关键点**：`async/await` 只能处理**异步 I/O 操作**（如 httpx、aiofiles），对于**同步阻塞调用**（如 DashScope SDK）无能为力。

```python
# 异步 I/O：不会阻塞事件循环
async def fetch_data():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com")  # ✅ 不阻塞

# 同步阻塞：会卡住事件循环
def dashscope_asr(audio_file):
    response = dashscope.call(...)  # ❌ 阻塞 19 秒
    return response
```

---

## 解决方案：线程池 + 信号量

### 1. 核心思路

```
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI 主线程（事件循环）                  │
│                                                             │
│   请求 1 ──→ asyncio.to_thread() ──→ 线程池                 │
│   请求 2 ──→ asyncio.to_thread() ──→ 线程池                 │
│   请求 3 ──→ asyncio.to_thread() ──→ 线程池                 │
│       ↓                                                      │
│   主线程继续处理其他请求，不被阻塞                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    线程池（操作系统管理）                       │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐                   │
│   │ 线程 1   │   │ 线程 2   │   │ 线程 3   │  并行执行同步调用  │
│   │ ASR调用  │   │ ASR调用  │   │ ASR调用  │                   │
│   └─────────┘   └─────────┘   └─────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### 2. 代码实现

```python
import asyncio
from fastapi import FastAPI, UploadFile
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()

# 创建信号量，限制最大并发数
MAX_CONCURRENCY = 50
semaphore = asyncio.Semaphore(MAX_CONCURRENCY)

# 同步的 ASR 函数（DashScope SDK）
def dashscope_asr_sync(audio_file: bytes) -> str:
    """
    同步阻塞调用，耗时约 19 秒
    """
    import dashscope
    from dashscope import MultiModalConversation

    response = MultiModalConversation.call(
        model='paraformer-realtime-v2',
        audio=audio_file,
    )
    return response.output.text

# 异步包装函数
async def run_asr_async(audio_file: bytes) -> str:
    """
    异步调用：信号量控制并发 + 线程池执行同步调用
    """
    async with semaphore:  # 获取信号量许可（最多 50 个并发）
        # 放入线程池执行，不阻塞事件循环
        result = await asyncio.to_thread(dashscope_asr_sync, audio_file)
        return result

# FastAPI 接口
@app.post("/asr/")
async def asr_endpoint(file: UploadFile):
    audio_data = await file.read()
    result = await run_asr_async(audio_data)
    return {"text": result}
```

### 3. 关键组件解析

#### asyncio.to_thread()

```python
# 语法
result = await asyncio.to_thread(func, *args)

# 等价于
loop = asyncio.get_event_loop()
result = await loop.run_in_executor(None, func, *args)
```

**作用**：把同步函数扔到**默认线程池**执行，返回一个 awaitable 对象。

**原理**：
1. 创建一个新线程（或复用线程池中的线程）
2. 在新线程中执行同步函数
3. 主线程（事件循环）继续处理其他请求
4. 同步函数执行完成后，通过 Future 通知主线程

#### asyncio.Semaphore()

```python
# 创建信号量，最多允许 50 个并发
semaphore = asyncio.Semaphore(50)

# 使用方式
async with semaphore:
    # 这里最多有 50 个协程同时执行
    result = await some_operation()
```

**作用**：限制同时执行的协程数量，防止资源耗尽。

**原理**：
- `acquire()`：计数器 -1，如果计数器为 0 则等待
- `release()`：计数器 +1，唤醒等待的协程
- `async with`：自动管理 acquire/release

---

## 完整实现

### 1. 服务层代码

```python
# services/asr_service.py
import asyncio
import logging
from typing import Optional
import dashscope
from dashscope import MultiModalConversation

from app.config import settings

logger = logging.getLogger(__name__)

class ASRService:
    def __init__(self):
        self.semaphore = asyncio.Semaphore(settings.MAX_CONCURRENCY)
        logger.info(f"ASR 服务初始化，并发限制: {settings.MAX_CONCURRENCY}")

    def _recognize_sync(self, audio_data: bytes) -> str:
        """
        同步 ASR 识别（阻塞调用）
        """
        try:
            response = MultiModalConversation.call(
                model='paraformer-realtime-v2',
                audio=audio_data,
                api_key=settings.DASHSCOPE_API_KEY,
            )

            if response.status_code == 200:
                return response.output.text
            else:
                raise Exception(f"ASR 调用失败: {response.code} - {response.message}")

        except Exception as e:
            logger.error(f"ASR 识别失败: {e}")
            raise

    async def recognize(self, audio_data: bytes) -> str:
        """
        异步 ASR 识别（非阻塞）
        """
        async with self.semaphore:
            logger.info(f"开始 ASR 识别，当前并发数: {settings.MAX_CONCURRENCY - self.semaphore._value}")
            result = await asyncio.to_thread(self._recognize_sync, audio_data)
            return result

# 创建全局实例
asr_service = ASRService()
```

### 2. 接口层代码

```python
# api/asr.py
from fastapi import APIRouter, UploadFile, HTTPException
from app.services.asr_service import asr_service

router = APIRouter()

@router.post("/asr/")
async def asr_endpoint(file: UploadFile):
    """
    ASR 语音识别接口
    """
    try:
        # 读取音频文件
        audio_data = await file.read()

        # 异步调用 ASR 服务
        text = await asr_service.recognize(audio_data)

        return {
            "code": 200,
            "message": "success",
            "data": {"text": text}
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 3. 配置文件

```python
# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # 并发配置
    MAX_CONCURRENCY: int = 50

    # DashScope 配置
    DASHSCOPE_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
```

### 4. 环境变量

```bash
# .env
MAX_CONCURRENCY=100
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 测试验证

### 1. 测试脚本

```python
# test_concurrent.py
import asyncio
import httpx
import time

async def send_asr_request(client: httpx.AsyncClient, file_path: str, index: int):
    """发送单个 ASR 请求"""
    start = time.time()

    with open(file_path, "rb") as f:
        response = await client.post(
            "http://localhost:8000/asr/",
            files={"file": ("test.wav", f, "audio/wav")}
        )

    elapsed = time.time() - start
    print(f"请求 {index}: {elapsed:.2f} 秒, 状态: {response.status_code}")
    return response.json()

async def test_concurrent_requests(num_requests: int = 100):
    """并发测试"""
    print(f"开始 {num_requests} 并发测试...")
    start = time.time()

    async with httpx.AsyncClient(timeout=120.0) as client:
        tasks = [
            send_asr_request(client, "sound/test.wav", i)
            for i in range(num_requests)
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    elapsed = time.time() - start
    success = sum(1 for r in results if not isinstance(r, Exception))
    print(f"\n测试完成:")
    print(f"  总请求数: {num_requests}")
    print(f"  成功数: {success}")
    print(f"  总耗时: {elapsed:.2f} 秒")
    print(f"  平均耗时: {elapsed/num_requests:.2f} 秒/请求")

if __name__ == "__main__":
    asyncio.run(test_concurrent_requests(100))
```

### 2. 测试结果

```
开始 100 并发测试...
请求 0: 19.23 秒, 状态: 200
请求 1: 19.45 秒, 状态: 200
...
请求 99: 19.67 秒, 状态: 200

测试完成:
  总请求数: 100
  成功数: 100
  总耗时: 19.89 秒
  平均耗时: 0.20 秒/请求
```

### 3. 性能对比

| 方案 | 并发数 | 总耗时 | 平均耗时/请求 |
|------|--------|--------|--------------|
| 原方案（同步阻塞） | 1-3 | 1900 秒 | 19 秒 |
| 线程池 + 信号量 | 100 | 19.89 秒 | 0.20 秒 |

**提升倍数**：95 倍

---

## 原理深入

### 1. asyncio.to_thread() 的本质

```python
# asyncio.to_thread() 的简化实现
async def to_thread(func, *args):
    loop = asyncio.get_event_loop()
    # 使用默认线程池执行器
    return await loop.run_in_executor(None, func, *args)

# run_in_executor 的工作流程
def run_in_executor(executor, func, *args):
    # 1. 创建一个 Future
    future = loop.create_future()

    # 2. 提交到线程池
    def callback():
        try:
            result = func(*args)
            loop.call_soon_threadsafe(future.set_result, result)
        except Exception as e:
            loop.call_soon_threadsafe(future.set_exception, e)

    executor.submit(callback)

    # 3. 返回 Future（可 await）
    return future
```

**关键点**：
- `loop.call_soon_threadsafe()`：线程安全地在事件循环中调度回调
- Future：代表一个未来会完成的结果
- 线程池：复用线程，避免频繁创建/销毁

### 2. Semaphore 的实现原理

```python
class Semaphore:
    def __init__(self, value: int):
        self._value = value  # 计数器
        self._waiters = []   # 等待队列

    async def acquire(self):
        # 如果计数器 > 0，直接获取
        if self._value > 0:
            self._value -= 1
            return

        # 否则，加入等待队列
        future = asyncio.get_event_loop().create_future()
        self._waiters.append(future)
        await future  # 挂起，等待唤醒

    def release(self):
        # 如果有等待者，唤醒一个
        if self._waiters:
            future = self._waiters.pop(0)
            future.set_result(None)
        else:
            # 否则，计数器 +1
            self._value += 1
```

### 3. 线程池 vs 进程池

| 特性 | 线程池 | 进程池 |
|------|--------|--------|
| 适用场景 | I/O 密集型 | CPU 密集型 |
| 内存共享 | 共享内存 | 独立内存 |
| 开销 | 较小 | 较大 |
| GIL 限制 | 受限 | 不受限 |
| 本案例 | ✅ 适合 | ❌ 过重 |

**为什么选择线程池？**
- ASR 调用是 I/O 密集型（等待网络响应）
- 线程池开销小，适合高并发
- 进程池需要序列化数据，开销大

---

## 常见问题

### 1. 为什么不用 multiprocessing？

```python
# multiprocessing 的问题
from multiprocessing import Pool

def asr_worker(audio_file):
    return dashscope_asr(audio_file)

# 需要序列化数据，开销大
with Pool(10) as p:
    results = p.map(asr_worker, audio_files)
```

**问题**：
- 需要 pickle 序列化，大文件开销大
- 进程创建/销毁开销大
- 内存占用高

### 2. 信号量设多大合适？

```python
# 经验公式
MAX_CONCURRENCY = min(
    CPU核心数 * 2,      # CPU 密集型
    100,                 # I/O 密集型上限
    第三方API限流阈值     # API 限制
)

# 本案例
MAX_CONCURRENCY = 50  # DashScope API 限流
```

### 3. 如何监控并发数？

```python
import asyncio
from prometheus_client import Gauge

# Prometheus 指标
concurrent_requests = Gauge(
    'asr_concurrent_requests',
    'Current number of concurrent ASR requests'
)

async def run_asr_async(audio_file):
    async with semaphore:
        concurrent_requests.inc()  # +1
        try:
            result = await asyncio.to_thread(dashscope_asr_sync, audio_file)
            return result
        finally:
            concurrent_requests.dec()  # -1
```

---

## 总结

### 核心要点

1. **问题本质**：同步阻塞调用卡住事件循环
2. **解决方案**：`asyncio.to_thread()` + `Semaphore`
3. **关键组件**：
   - 线程池：让同步调用不阻塞主线程
   - 信号量：防止并发过高搞崩系统

### 最佳实践

```python
# ✅ 正确做法
async def process_request():
    async with semaphore:  # 1. 限制并发
        result = await asyncio.to_thread(sync_func)  # 2. 线程池执行
        return result

# ❌ 错误做法
async def process_request():
    result = sync_func()  # 直接调用，阻塞事件循环
    return result
```

### 适用场景

| 场景 | 是否适用 |
|------|---------|
| 第三方同步 SDK（如 DashScope） | ✅ 适用 |
| 数据库同步查询 | ✅ 适用 |
| 文件 I/O 操作 | ✅ 适用 |
| CPU 密集型计算 | ❌ 用进程池 |

---

## 参考资料

- [Python asyncio 官方文档](https://docs.python.org/3/library/asyncio.html)
- [FastAPI 并发指南](https://fastapi.tiangolo.com/async/)
- [asyncio.to_thread() 文档](https://docs.python.org/3/library/asyncio-task.html#asyncio.to_thread)

---

## 后记

这次并发优化让我深刻理解了 FastAPI 的异步机制：

1. **async/await 不是万能的**：只能处理异步 I/O，同步调用需要特殊处理
2. **线程池是桥梁**：连接同步世界和异步世界
3. **信号量是安全阀**：防止并发过高导致系统崩溃

希望这篇文章能帮助遇到类似问题的开发者，少走弯路。

---

*本文基于实际项目经验整理，完整代码见项目仓库。*
