---
title: "Dify 实战：API 调用与 Agent 应用开发"
date: 2026-06-02T10:00:00+08:00
draft: false
description: "深入 Dify 的 API 集成和 Agent 应用开发，包括 Chatflow 和 Agent 的 API 调用方式、流式响应处理、工具调用等实战内容"
categories: ["AI"]
tags: ["Dify", "API", "Agent", "LLM", "Python"]
author: "AnfinsenYu"
showToc: true
TocOpen: false
---

# Dify 实战：API 调用与 Agent 应用开发

> 本文是 Dify 实战系列的第三篇，深入介绍如何通过 API 调用 Dify 应用，以及如何开发和测试 Agent 应用。
>
> 基于前两篇的环境部署和工作流搭建，我们将完成最后两个核心功能的验证。

---

## 一、项目背景

领导交代的任务是验证 Dify 平台的三个核心功能：

| 功能 | 状态 | 说明 |
|------|------|------|
| 工作流 (Chatflow) | ✅ | 考勤知识库 + 请假申请 |
| API 调用 | ✅ | 本文重点 |
| Agent 应用 | ✅ | 本文重点 |

### 环境配置

- **Dify 版本**：v1.14.2
- **部署方式**：Docker Compose（12 个容器）
- **模型**：Ollama（本地）+ 百炼 DeepSeek（阿里云）
- **Web UI**：http://localhost:8080

---

## 二、Dify API 架构

### 2.1 API 类型

Dify 提供两种 API：

| API 类型 | 路径 | 用途 | 认证方式 |
|----------|------|------|----------|
| **Console API** | `/console/api` | 管理后台（创建应用、配置等） | Session Token |
| **Service API** | `/v1` | 应用调用（对话、补全等） | API Key |

### 2.2 API 端点总览

```
# Console API（需要登录）
POST   /console/api/login              # 登录
GET    /console/api/apps                # 应用列表
POST   /console/api/apps                # 创建应用

# Service API（使用 API Key）
POST   /v1/chat-messages               # 对话消息（Chatflow/Agent）
POST   /v1/completion-messages          # 补全消息（Completion）
GET    /v1/parameters                   # 获取应用参数
GET    /v1/meta                         # 获取应用元数据
POST   /v1/files/upload                 # 上传文件
POST   /v1/audio-to-text               # 语音转文字
POST   /v1/text-to-audio               # 文字转语音
```

---

## 三、Chatflow API 调用

### 3.1 获取 API Key

1. 在 Dify Web UI 中打开 Chatflow 应用
2. 点击左侧「API 访问」
3. 点击「创建 API Key」
4. 复制保存（格式：`app-xxxxxxxxxxxx`）

### 3.2 同步调用（Blocking）

同步调用会等待 Agent 完成所有处理后返回结果。

```python
import requests
import json

API_KEY = "app-xxxxxxxxxxxxxxxx"  # 替换为你的 API Key
API_URL = "http://localhost:8080/v1/chat-messages"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "inputs": {},
    "query": "公司的考勤制度是什么？",
    "response_mode": "blocking",
    "user": "test-user"
}

response = requests.post(API_URL, headers=headers, json=data, timeout=30)
result = response.json()

print(f"回答: {result['answer']}")
print(f"会话ID: {result['conversation_id']}")
```

**响应示例：**

```json
{
  "answer": "根据公司考勤管理制度，主要内容如下：\n\n1. 工作时间：每周五天，上午9:00-12:00，下午13:30-18:00\n2. 请假类型：事假、病假、年假、婚假、产假、丧假、调休\n...",
  "conversation_id": "conv-xxxxx",
  "message_id": "msg-xxxxx",
  "metadata": {
    "retriever_resources": [...]
  }
}
```

### 3.3 流式调用（Streaming）

流式调用会逐步返回 Agent 的回答，适合实时显示。

```python
import requests
import json

data = {
    "inputs": {},
    "query": "迟到怎么扣款？",
    "response_mode": "streaming",
    "user": "test-user"
}

response = requests.post(API_URL, headers=headers, json=data, stream=True, timeout=60)

answer = ""
for line in response.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith('data: '):
            event_data = json.loads(line[6:])
            event_type = event_data.get('event', '')

            if event_type == 'message':
                answer_chunk = event_data.get('answer', '')
                answer += answer_chunk
                print(answer_chunk, end='', flush=True)
            elif event_type == 'message_end':
                print(f"\n\n会话ID: {event_data.get('conversation_id', '')}")

print(f"完整回答: {answer}")
```

**SSE 事件类型：**

| 事件 | 说明 |
|------|------|
| `message` | 消息内容块 |
| `message_end` | 消息结束 |
| `agent_thought` | Agent 思考过程 |
| `tool_call` | 工具调用 |
| `error` | 错误 |

### 3.4 多轮对话

通过 `conversation_id` 实现上下文连续对话：

```python
def chat(query, conversation_id="", user_id="test-user"):
    data = {
        "inputs": {},
        "query": query,
        "response_mode": "streaming",
        "user": user_id,
        "conversation_id": conversation_id
    }

    response = requests.post(API_URL, headers=headers, json=data, stream=True, timeout=60)

    answer = ""
    for line in response.iter_lines():
        if line:
            line = line.decode('utf-8')
            if line.startswith('data: '):
                event_data = json.loads(line[6:])
                if event_data.get('event') == 'message':
                    answer += event_data.get('answer', '')
                elif event_data.get('event') == 'message_end':
                    conversation_id = event_data.get('conversation_id', '')

    return answer, conversation_id

# 多轮对话示例
conv_id = ""
questions = [
    "公司的考勤制度是什么？",
    "迟到怎么扣款？",
    "请假需要提前多久申请？"
]

for q in questions:
    print(f"\n用户: {q}")
    answer, conv_id = chat(q, conv_id)
    print(f"Agent: {answer}")
```

---

## 四、Agent 应用开发

### 4.1 Agent vs Chatflow

| 特性 | Chatflow 工作流 | Agent 应用 |
|------|-----------------|------------|
| 控制方式 | 固定流程 | 动态决策 |
| 灵活性 | 低 | 高 |
| 可预测性 | 高 | 中 |
| 适用场景 | 标准流程 | 复杂问答 |
| 知识库配置 | 独立节点 | 内置配置栏 |
| 工具使用 | 需要定义节点 | 自动选择 |
| API 模式 | 支持 blocking/streaming | 仅支持 streaming |
| 迭代能力 | 无 | 最多 10 次迭代 |

### 4.2 创建 Agent 应用

1. 在 Dify Web UI 点击「创建应用」
2. 选择「Agent」类型
3. 填写信息：
   - 名称：`考勤助手Agent`
   - 描述：`基于考勤知识库的智能Agent`

### 4.3 配置 Agent

#### 模型设置
- **模型**：选择 `deepseek-r1`（百炼）
- **策略**：`Function Calling`（推荐，更稳定）

#### 知识库配置
1. 在 Agent 配置页面找到「知识库」栏
2. 点击添加，选择已创建的「考勤制度」知识库
3. 参数设置：
   - 检索模式：语义检索
   - Top K：3

> **注意**：Agent 的知识库配置与 Chatflow 不同，不需要通过工具添加，有专门的配置栏。

#### 工具配置
1. 点击「添加工具」
2. 选择「获取当前时间」工具

#### 系统提示词

```
你是一个考勤制度专家助手。你的任务是：
1. 根据用户的问题，检索考勤知识库获取准确信息
2. 用清晰、专业的语言回答用户的问题
3. 如果涉及时间相关问题（如"今天"、"本周"），使用获取当前时间工具
4. 如果知识库中没有相关信息，明确告知用户

请用中文回答，保持专业和友好的语气。
```

### 4.4 Agent 配置原理

Agent 的配置存储在 `app_model_configs` 表的 `agent_mode` 字段中：

```json
{
  "enabled": true,
  "strategy": "function-calling",
  "tools": [
    {
      "enabled": true,
      "provider_type": "dataset",
      "provider_id": "dataset-id",
      "tool_name": "知识库检索",
      "tool_parameters": {}
    },
    {
      "enabled": true,
      "provider_type": "builtin",
      "provider_id": "time",
      "tool_name": "current_time",
      "tool_parameters": {}
    }
  ]
}
```

---

## 五、Agent API 调用

### 5.1 API Key 配置

Agent 应用的 API Key 与 Chatflow 独立：

```python
API_KEY = "app-xxxxxxxxxxxxxxxx"  # 替换为你的 Agent API Key
API_URL = "http://localhost:8080/v1/chat-messages"
```

### 5.2 流式调用

**重要**：Agent Chat App 仅支持流式模式，不支持同步模式。

```python
import requests
import json

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "inputs": {},
    "query": "公司的考勤制度是什么？",
    "response_mode": "streaming",  # Agent 仅支持 streaming
    "user": "test-user"
}

response = requests.post(API_URL, headers=headers, json=data, stream=True, timeout=60)

answer = ""
for line in response.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith('data: '):
            event_data = json.loads(line[6:])
            event_type = event_data.get('event', '')

            if event_type == 'message':
                answer_chunk = event_data.get('answer', '')
                answer += answer_chunk
                print(answer_chunk, end='', flush=True)
            elif event_type == 'agent_thought':
                thought = event_data.get('thought', '')
                if thought:
                    print(f"\n[思考] {thought}")
            elif event_type == 'tool_call':
                tool_name = event_data.get('tool_name', '')
                tool_input = event_data.get('tool_input', '')
                print(f"\n[工具调用] {tool_name}: {tool_input}")
            elif event_type == 'message_end':
                print(f"\n\n✅ 调用完成")
```

### 5.3 工具调用示例

Agent 会自动选择合适的工具：

```python
# 测试时间工具
data = {
    "inputs": {},
    "query": "今天是几号？现在几点了？",
    "response_mode": "streaming",
    "user": "test-user"
}

# Agent 会自动调用 current_time 工具
# 输出示例：
# [思考] 用户想知道当前的时间和日期。我可以使用 current_time 工具来获取当前时间。
# [工具调用] current_time: {}
# 今天的日期是 2026年6月2日（星期二），当前时间是 凌晨 01:42。
```

---

## 六、完整测试脚本

### 6.1 脚本功能

测试脚本 `agent-api-test.py` 包含以下测试：

| 测试函数 | 说明 |
|----------|------|
| `test_parameters()` | 获取应用参数 |
| `test_meta()` | 获取应用元数据 |
| `test_blocking_mode()` | 同步模式测试（Agent 不支持） |
| `test_streaming_mode()` | 流式模式测试 |
| `test_time_tool()` | 时间工具测试 |
| `test_multi_turn()` | 多轮对话测试 |

### 6.2 运行测试

```bash
cd D:\Coding\Claude\Dify
python agent-api-test.py
```

### 6.3 测试结果

```
Dify Agent API 测试
时间: 2026-06-02 09:41:45
API 地址: http://localhost:8080/v1/chat-messages

==================================================
测试获取应用参数
==================================================
✅ 参数获取成功

==================================================
测试获取应用元数据
==================================================
✅ 元数据获取成功

==================================================
测试同步模式 (blocking)
==================================================
⚠️  Agent Chat App 不支持同步模式，跳过此测试

==================================================
测试流式模式 (streaming)
==================================================
✅ 流式调用开始，状态码: 200
[思考] 用户想了解公司的考勤制度。我需要从考勤知识库中检索相关信息。
✅ 流式调用完成

==================================================
测试时间工具
==================================================
✅ 时间工具测试开始，状态码: 200
[思考] 用户想知道当前的时间和日期。我可以使用 current_time 工具来获取当前时间。
[工具调用] current_time: {}
今天的日期是 2026年6月2日（星期二），当前时间是 凌晨 01:42。
✅ 时间工具测试完成

==================================================
测试多轮对话
==================================================
--- 第 1 轮对话 ---
用户: 公司的考勤制度是什么？
Agent: 以下是我根据公司考勤知识库整理的公司考勤制度主要内容...

--- 第 2 轮对话 ---
用户: 迟到怎么扣款？
Agent: 根据公司考勤管理制度，关于迟到（及早退）的扣款规定如下...

--- 第 3 轮对话 ---
用户: 请假需要提前多久申请？
Agent: 根据公司考勤管理制度，不同请假类型的申请提前时间要求如下...

--- 第 4 轮对话 ---
用户: 今天星期几？
Agent: 根据当前时间查询，今天是 2026年6月2日（星期二）

==================================================
所有测试完成!
==================================================
```

---

## 七、常见问题

### Q1: Agent 不支持同步模式

**现象**：调用时报错 `Agent Chat App does not support blocking mode`

**解决**：Agent 仅支持流式模式，使用 `response_mode: "streaming"`

### Q2: 知识库检索失败

**现象**：Agent 回答"知识库中没有相关信息"

**解决**：
1. 检查 Embedding 模型（Ollama）是否启动
2. 确认知识库索引状态为「可用」
3. 检查 Agent 的知识库配置是否正确

### Q3: 工具调用失败

**现象**：Agent 没有调用预期的工具

**解决**：
1. 检查工具是否启用
2. 确认系统提示词中提到了工具使用场景
3. 尝试更明确的提问方式

### Q4: 多轮对话上下文丢失

**现象**：后续对话没有继承之前的上下文

**解决**：
1. 确保传递了正确的 `conversation_id`
2. 使用同一个 `user_id`

---

## 八、总结

### 功能对比

| 功能 | Chatflow | Agent | 推荐场景 |
|------|----------|-------|----------|
| 知识库问答 | ✅ | ✅ | 简单问答用 Agent，复杂流程用 Chatflow |
| 工具调用 | 需定义节点 | 自动选择 | Agent 更灵活 |
| 多轮对话 | ✅ | ✅ | 两者都支持 |
| API 调用 | blocking/streaming | 仅 streaming | 需要同步用 Chatflow |
| 可预测性 | 高 | 中 | 业务流程用 Chatflow |

### 使用建议

1. **简单问答**：使用 Agent，配置简单，自动选择工具
2. **标准流程**：使用 Chatflow，逻辑清晰可控
3. **系统集成**：使用 API，支持流式和同步两种模式
4. **复杂场景**：Agent + 工具组合，支持多步骤推理

### 下一步

- 探索更多 Dify 功能（高级编排、插件等）
- 生产环境部署（HTTPS、域名、监控）
- 性能优化（缓存、并发控制）

---

## 附件

| 文件 | 说明 |
|------|------|
| `agent-api-test.py` | Agent API 测试脚本 |
| `api-test.py` | Chatflow API 测试脚本 |
| `task-completion-report.md` | 任务完成报告 |

---

*本文基于 Dify v1.14.2，项目地址：https://github.com/langgenius/dify*

*上一篇：[Dify 实战：从零搭建智能请假申请工作流]({{< relref "/posts/Dify-workflow" >}})*
