---
title: "RAGFlow 本地安装部署完整指南"
date: 2026-06-02T11:00:00+08:00
draft: false
description: "从零开始搭建企业级 RAG 应用，附踩坑记录与解决方案"
categories: ["AI"]
tags: ["RAGFlow", "RAG", "Docker", "Ollama", "部署"]
author: "AnfinsenYu"
showToc: true
TocOpen: false
---

# RAGFlow 本地安装部署完整指南

> 从零开始搭建企业级 RAG 应用，附踩坑记录与解决方案

---

## 一、RAGFlow 简介

RAGFlow 是一款基于深度文档理解的开源 RAG（Retrieval-Augmented Generation）引擎，支持多种文档格式的智能解析与检索。相比 Dify 等平台，RAGFlow 的 RAG 管道更重（查询改写 → 检索 → Rerank → 生成），但检索精度更高。

### 核心特性
- 深度文档解析（PDF、Word、Excel、PPT 等）
- 支持多种 Embedding 和 LLM 模型
- 可视化知识库管理
- Docker 一键部署

---

## 二、环境准备

### 2.1 系统要求

| 组件 | 最低配置 | 推荐配置 |
|------|---------|---------|
| OS | Windows 10/11、Linux、macOS | Windows 11 / Ubuntu 22.04 |
| 内存 | 16GB | 32GB+ |
| 磁盘 | 50GB 可用空间 | 100GB+ SSD |
| GPU | 无（CPU 可运行） | NVIDIA GPU 8GB+ 显存 |
| Docker | 20.10+ | 最新版 |
| Docker Compose | 2.0+ | 最新版 |

### 2.2 安装 Docker Desktop（Windows）

1. 下载 Docker Desktop：https://www.docker.com/products/docker-desktop/
2. 安装并启用 WSL2 后端
3. 确认安装成功：
   ```bash
   docker --version
   docker compose version
   ```

### 2.3 GPU 支持准备（可选但强烈推荐）

**为什么需要 GPU？**
- PDF（尤其是扫描件/图片型 PDF）在 CPU 上解析非常慢，容易导致电脑卡死
- GPU 加速后响应速度提升显著

**NVIDIA GPU 配置步骤：**

1. 更新显卡驱动到最新版本
2. 安装 NVIDIA Container Toolkit：
   ```bash
   # Ubuntu
   distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
   curl -s -L https://nvidia.github.io/libnvidia-container/gpgkey | sudo apt-key add -
   curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
   sudo apt-get update
   sudo apt-get install -y nvidia-container-toolkit
   sudo systemctl restart docker
   ```

3. 验证 GPU 在 Docker 中可用：
   ```bash
   docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
   ```

---

## 三、安装 RAGFlow

### 3.1 克隆项目

```bash
git clone https://github.com/infiniflow/ragflow.git
cd ragflow
```

### 3.2 ⚠️ 重要：选择正确的版本

**踩坑记录：** 最新版本的 RAGFlow 默认是 **slim 版本**，去掉了模型设置选项，无法在界面中配置本地模型。

**解决方案：切换到旧版本**

```bash
# 查看可用版本
git tag -l

# 切换到包含完整功能的版本（推荐 v0.16.0 或更早）
git checkout v0.16.0
```

或者修改 `docker/.env` 文件，指定非 slim 镜像：

```bash
# 修改 docker/.env
RAGFLOW_IMAGE=infiniflow/ragflow:v0.16.0
# 而不是默认的 slim 版本
# RAGFLOW_IMAGE=infiniflow/ragflow:v0.16.0-slim
```

### 3.3 配置环境变量

编辑 `docker/.env` 文件：

```bash
# 核心配置
RAGFLOW_IMAGE=infiniflow/ragflow:v0.16.0

# Elasticsearch 配置（默认即可）
ES_HOSTS=http://es01:9200

# 如需 GPU 支持，取消注释以下行
# NVIDIA_VISIBLE_DEVICES=all
```

### 3.4 启动服务

```bash
cd docker
docker compose up -d
```

等待所有服务启动完成（首次启动需要拉取镜像，可能需要 10-30 分钟）：

```bash
# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
```

### 3.5 访问 RAGFlow

浏览器打开：http://localhost:9380

首次访问需要注册管理员账号。

---

## 四、配置模型

### 4.1 配置本地 Ollama 模型

**为什么用本地模型？**
- 默认的在线 Embedding 模型效果一般
- 本地模型响应更快，无需网络
- 数据不出本地，更安全

**安装 Ollama：**

```bash
# Windows/macOS：访问 https://ollama.com 下载安装

# 拉取模型
ollama pull deepseek-r1:1.5b      # 聊天模型
ollama pull bge-m3:latest          # Embedding 模型（推荐）
```

**在 RAGFlow 中配置：**

1. 进入 **设置** → **模型管理**
2. 添加 LLM 模型：
   - 类型：Ollama
   - 名称：DeepSeek R1
   - Base URL：`http://host.docker.internal:11434`（Docker 内访问宿主机）
   - 模型名称：`deepseek-r1:1.5b`

3. 添加 Embedding 模型：
   - 类型：Ollama
   - 名称：BGE-M3
   - Base URL：`http://host.docker.internal:11434`
   - 模型名称：`bge-m3:latest`

> **提示：** `host.docker.internal` 是 Docker 内部访问宿主机的特殊域名。

### 4.2 模型选择建议

| 用途 | 推荐模型 | 说明 |
|------|---------|------|
| 聊天（轻量） | DeepSeek R1 1.5B | 速度快，适合简单问答 |
| 聊天（高质量） | DeepSeek R1 7B/14B | 回答质量更高，需要更多显存 |
| Embedding | bge-m3:latest | 中文效果好，推荐使用 |

---

## 五、创建知识库

### 5.1 上传文档

1. 进入 **知识库** 页面，创建新知识库
2. 上传文档（支持 PDF、Word、TXT、Excel 等）
3. 选择解析方法：
   - **通用文档**：适用于普通文本 PDF
   - **扫描件/图片 PDF**：需要 OCR，速度较慢

### 5.2 ⚠️ 踩坑：PDF 解析慢的问题

**问题描述：**
- 图片型 PDF（扫描件）解析非常慢
- 在 CPU 上运行时容易导致电脑卡死

**解决方案：**

1. **使用 GPU 加速**（最有效）
   - 确保显卡驱动已更新到最新版本
   - 配置 NVIDIA Container Toolkit（见上文）
   - 重启 Docker 服务

2. **优化解析策略**
   - 优先使用文字型 PDF，避免扫描件
   - 大文档分批上传
   - 调整并发解析数量

3. **硬件升级**
   - 增加内存到 32GB+
   - 使用 SSD 硬盘

---

## 六、创建聊天助手

1. 进入 **聊天** 页面，创建新助手
2. 选择关联的知识库
3. 配置模型参数：
   - LLM：选择配置好的 DeepSeek 模型
   - Temperature：0.1-0.3（知识问答建议低温度）
4. 测试问答效果

---

## 七、常见问题 FAQ

### Q1: 为什么找不到模型设置选项？
**A:** 你可能使用了 slim 版本。请切换到完整版镜像（见第三节）。

### Q2: Docker 内无法访问 Ollama？
**A:** 确保使用 `http://host.docker.internal:11434` 而不是 `http://localhost:11434`。

### Q3: PDF 解析报错？
**A:** 检查文件是否损坏，尝试用其他 PDF 重新导出。扫描件 PDF 建议先用 OCR 工具处理。

### Q4: 回答质量不好？
**A:** 
- 尝试升级到更大的模型（7B/14B）
- 检查知识库文档质量
- 调整 Chunk 分割策略

### Q5: GPU 没有被使用？
**A:** 
```bash
# 检查 NVIDIA Container Toolkit
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi

# 检查 docker-compose.yml 中的 GPU 配置
# 确保有 deploy.resources.reservations.devices 配置
```

---

## 八、性能优化建议

1. **Embedding 模型**：使用 `bge-m3:latest` 替代默认模型，速度和效果都更好
2. **GPU 加速**：显卡驱动更新 + NVIDIA Container Toolkit 配置
3. **文档预处理**：扫描件先 OCR，大文档拆分后上传
4. **资源分配**：确保 Docker 有足够内存（建议 16GB+）

---

## 九、参考资源

### 官方资源
- [RAGFlow GitHub 仓库](https://github.com/infiniflow/ragflow)
- [RAGFlow 官方文档](https://ragflow.io/docs/dev/)

### 教程与文章
- [DeepSeek + RAGFlow 实战教程（Notion）](https://six-cheek-4f5.notion.site/DeepSeek-RAGflow-19635f95774680e98607fe452e03ceb8)
- [RAGFlow 部署与配置详解（CSDN）](https://blog.csdn.net/gr1785/article/details/145543754)
- [RAGFlow 知识库搭建实践（知乎）](https://zhuanlan.zhihu.com/p/22064512226)
- [RAGFlow 安装踩坑记录（CSDN）](https://blog.csdn.net/qq_42869414/article/details/144966813)

### 视频资源
- [哔哩哔哩：DeepSeek + RAGFlow 实战教程](https://www.bilibili.com/video/BV1WiP2ezE5a/) — 评论区附有项目演示 PPT

---

## 十、总结

RAGFlow 是一个功能强大的 RAG 引擎，但在安装部署过程中有一些需要注意的坑：

| 问题 | 解决方案 |
|------|---------|
| slim 版本无模型设置 | 切换到完整版镜像 |
| PDF 解析慢/卡死 | GPU 加速 + 显卡驱动更新 |
| 默认 Embedding 效果差 | 使用本地 bge-m3 模型 |
| Docker 内访问本地模型 | 使用 host.docker.internal |

掌握这些要点后，你就能顺利搭建一个高性能的本地 RAG 应用了。

---

*最后更新：2026年6月*
