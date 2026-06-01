---
title: "Dify 安装部署指南：Docker Compose 一键搭建 LLM 应用平台"
date: 2026-06-01T10:00:00+08:00
draft: false
description: "在 Windows 环境下使用 Docker Compose 部署 Dify v1.14.2 的完整过程，包括模型配置和常见问题处理"
categories: ["AI"]
tags: ["Dify", "Docker", "LLM", "部署"]
author: "AnfinsenYu"
showToc: true
TocOpen: false
---

# Dify 安装部署指南：Docker Compose 一键搭建 LLM 应用平台

> 本文记录了在 Windows 环境下使用 Docker Compose 部署 Dify v1.14.2 的完整过程，包括模型配置（Ollama + 百炼 DeepSeek）和常见问题处理。
>
> 这是 Dify 实战系列的第一篇，后续将基于此环境搭建智能请假申请工作流。

---

## 一、Dify 简介

[Dify](https://github.com/langgenius/dify) 是一个开源的 LLM 应用开发平台，提供：

- **可视化工作流编排**：拖拽式构建 AI 工作流
- **RAG 管道**：文档上传、分段、向量化、检索
- **Agent 能力**：自主决策、工具调用
- **模型管理**：支持 OpenAI、DeepSeek、Ollama 等数十种模型
- **API 服务**：一键发布为 API，方便集成

## 二、系统要求

| 要求 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 2 核 | 4 核+ |
| 内存 | 4 GB | 8 GB+ |
| 磁盘 | 20 GB | 50 GB+ |
| Docker | 已安装 | Docker Desktop 4.x+ |
| Docker Compose | 已安装 | v2.x |

## 三、安装步骤

### 3.1 获取项目

```bash
# 克隆项目
git clone https://github.com/langgenius/dify.git

# 进入 Docker 部署目录
cd dify/docker
```

### 3.2 配置环境变量

```bash
# 复制示例配置
cp .env.example .env
```

编辑 `.env` 文件，修改以下关键配置：

```bash
# ===== 端口配置 =====
# Windows 下 80 端口常被占用，改为 8080
EXPOSE_NGINX_PORT=8080
EXPOSE_NGINX_SSL_PORT=443

# ===== 数据库配置 =====
DB_USERNAME=postgres
DB_PASSWORD=difyai123456    # 生产环境请修改

# ===== Redis 配置 =====
REDIS_PASSWORD=difyai123456  # 生产环境请修改

# ===== 向量数据库 =====
# 默认使用 Weaviate，也支持 Milvus、Qdrant、PGVector 等
VECTOR_STORE=weaviate

# ===== 数据库类型 =====
# 默认 PostgreSQL，也支持 MySQL
DB_TYPE=postgresql

# ===== 组合配置 =====
# 自动根据上面的配置选择要启动的服务
COMPOSE_PROFILES=${VECTOR_STORE:-weaviate},${DB_TYPE:-postgresql},collaboration
```

### 3.3 启动服务

```bash
# 拉取镜像并启动所有服务（后台运行）
docker compose up -d
```

首次启动需要下载镜像，大约需要 5-10 分钟（取决于网络速度）。

### 3.4 验证服务状态

```bash
# 查看所有容器状态
docker compose ps
```

正常情况下应该看到 12 个容器：

```
NAME                    STATUS          PORTS
docker-api-1            healthy         5001/tcp
docker-web-1            Up              3000/tcp
docker-worker-1         Up
docker-worker_beat-1    Up
docker-db_postgres-1    healthy         5432/tcp
docker-redis-1          healthy         6379/tcp
docker-weaviate-1       Up              8080/tcp
docker-sandbox-1        healthy         8194/tcp
docker-plugin_daemon-1  Up              0.0.0.0:5003->5003/tcp
docker-nginx-1          Up              0.0.0.0:8080->80/tcp, 0.0.0.0:443->443/tcp
docker-ssrf_proxy-1     Up              3128/tcp
docker-init_permissions-1 Exited (0)
```

### 3.5 初始化设置

1. 打开浏览器访问：**http://localhost:8080/install**
2. 首次访问会进入初始化向导
3. 创建管理员账号（邮箱 + 密码）
4. 完成初始化后即可进入主界面

## 四、架构概览

Dify 的 Docker 部署包含以下核心组件：

```
                    ┌─────────────┐
                    │   Nginx     │  :8080 (HTTP) / :443 (HTTPS)
                    │  反向代理    │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────────┐
    │ Web 前端  │   │ API 后端  │   │ Plugin Daemon│
    │ Next.js  │   │  Flask   │   │   插件守护     │
    │  :3000   │   │  :5001   │   │   :5002/5003  │
    └──────────┘   └────┬─────┘   └──────────────┘
                        │
            ┌───────────┼───────────┐
            │           │           │
            ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │PostgreSQL│ │  Redis   │ │ Weaviate │
    │  数据库   │ │  缓存    │ │ 向量数据库 │
    │  :5432   │ │  :6379   │ │  :8080   │
    └──────────┘ └──────────┘ └──────────┘
```

### Nginx 路由规则

| 路径 | 转发目标 | 说明 |
|------|---------|------|
| `/console/api` | api:5001 | 管理后台 API |
| `/api` | api:5001 | 公共 API |
| `/v1` | api:5001 | Service API（外部调用） |
| `/files` | api:5001 | 文件服务 |
| `/mcp` | api:5001 | MCP 协议 |
| `/socket.io/` | api_websocket:5001 | WebSocket |
| `/e/` | plugin_daemon:5002 | 插件服务 |
| `/` | web:3000 | 前端页面 |

## 五、模型配置

### 5.1 配置 Ollama（本地模型）

如果你在本地运行了 [Ollama](https://ollama.ai)，可以直接在 Dify 中使用本地模型。

**步骤：**

1. 确保 Ollama 已运行且模型已下载：
   ```bash
   # 检查 Ollama 状态
   curl http://localhost:11434/api/tags

   # 下载模型（如未下载）
   ollama pull qwen2.5:7b
   ollama pull bge-m3      # Embedding 模型
   ```

2. 在 Dify 中配置：
   - 进入 **设置** → **模型供应商** → 找到 **Ollama** → **添加模型**

3. 填写配置：

   | 配置项 | 值 | 说明 |
   |--------|-----|------|
   | 模型名称 | `qwen2.5:7b` | 与 `ollama list` 中的名称一致 |
   | 基础 URL | `http://host.docker.internal:11434` | Docker 宿主机地址 |
   | 模型类型 | LLM | 对话模型选 LLM |
   | 完成模式 | Chat | 对话模型选 Chat |

   > **Embedding 模型**：模型类型选 Text Embedding，名称填 `bge-m3`

**关于 Base URL：**

| 环境 | URL |
|------|-----|
| Windows/Mac (Docker Desktop) | `http://host.docker.internal:11434` |
| Linux (Docker) | `http://172.17.0.1:11434`（Docker 桥接网络 IP） |
| Ollama 也在 Docker 中 | `http://ollama-container-name:11434` |

### 5.2 配置百炼 DeepSeek（阿里云）

百炼是阿里云的模型服务平台，支持 DeepSeek、Qwen 等多种模型。

**步骤：**

1. 获取 API Key：
   - 访问 [百炼控制台](https://bailian.console.aliyun.com/?apiKey=1#/api-key)
   - 创建 API Key

2. 在 Dify 中配置：
   - 进入 **设置** → **模型供应商** → 找到 **通义（Tongyi）** → **设置**

3. 填写配置：

   | 配置项 | 值 |
   |--------|-----|
   | API Key | 你的百炼 API Key |

4. 保存后，可以在模型列表中选择：
   - `deepseek-v3`、`deepseek-r1` 等 DeepSeek 模型
   - `qwen-max`、`qwen-plus` 等 Qwen 模型

### 5.3 直接配置 DeepSeek 官方

如果使用 DeepSeek 官方 API（非百炼）：

1. 获取 API Key：https://platform.deepseek.com/api_keys
2. 在 Dify 中：**设置** → **模型供应商** → **DeepSeek** → **设置**
3. 填入 API Key 即可

## 六、数据持久化

所有持久化数据存储在 `docker/volumes/` 目录下：

```
docker/volumes/
├── db/data/              # PostgreSQL 数据
├── redis/data/           # Redis 数据
├── app/storage/          # 应用文件存储
├── weaviate/             # Weaviate 向量数据
├── plugin_daemon/        # 插件数据（含已安装插件）
└── sandbox/dependencies/ # 沙箱依赖
```

> **备份建议**：定期备份 `volumes/` 目录，即可保存所有数据和配置。

## 七、常用运维命令

```bash
# 查看服务状态
docker compose ps

# 查看日志（实时跟踪）
docker compose logs -f api
docker compose logs -f worker

# 重启单个服务
docker compose restart api

# 停止所有服务
docker compose down

# 停止并删除数据卷（慎用！会丢失数据）
docker compose down -v

# 更新到最新版本
docker compose pull
docker compose up -d
```

## 八、常见问题

### Q1: 端口 80 被占用

**现象**：启动时报错 `bind: address already in use`

**解决**：修改 `.env` 中的端口：
```bash
EXPOSE_NGINX_PORT=8080
```

### Q2: Docker 容器内无法访问宿主机服务

**现象**：配置 Ollama 时连接失败

**解决**：
- Windows/Mac：使用 `http://host.docker.internal:11434`
- Linux：使用 `http://172.17.0.1:11434` 或在 docker-compose 中添加 `extra_hosts`

### Q3: 知识库索引失败

**现象**：上传文档后状态一直显示"索引中"或"错误"

**解决**：
1. 检查 Embedding 模型是否配置正确
2. 查看 worker 日志：`docker compose logs -f worker`
3. 确认向量数据库（Weaviate）正常运行

### Q4: 模型调用超时

**现象**：发送消息后长时间无响应

**解决**：
1. 检查模型 API Key 是否正确
2. 检查网络连接（特别是调用外部 API 时）
3. 尝试换一个模型测试

### Q5: 容器启动失败

**现象**：某个容器状态为 `Exited` 或 `Restarting`

**解决**：
```bash
# 查看具体错误日志
docker compose logs <service-name>

# 常见原因：端口冲突、磁盘空间不足、配置文件错误
```

## 九、总结

Dify 的 Docker Compose 部署非常便捷，核心步骤就三步：

1. `cp .env.example .env` — 复制配置
2. `docker compose up -d` — 启动服务
3. 访问 `http://localhost:8080/install` — 初始化

模型配置方面，Ollama 本地模型注意使用 `host.docker.internal` 地址，百炼/DeepSeek 只需要一个 API Key 即可。

环境搭建完成后，就可以开始构建 AI 应用了。下一篇我们将实战搭建一个智能请假申请工作流。

---

*本文基于 Dify v1.14.2，项目地址：https://github.com/langgenius/dify*

*下一篇：[Dify 实战：从零搭建智能请假申请工作流](Dify-请假工作流从0到1.md)*
