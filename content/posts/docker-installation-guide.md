---
title: "Docker Windows 安装指南"
date: 2026-05-13T10:00:00+08:00
draft: false
description: "基于 Docker Desktop + WSL2 的完整安装流程"
categories: ["技术"]
tags: ["Docker", "教程", "Windows"]
author: ""
showToc: true
TocOpen: true
---

## 一、Docker 简介

Docker 是一个让应用在"隔离环境"（容器）中运行的工具。关键概念：Docker 依赖 Linux 内核环境，本质上是在已运行的 Linux 系统中创建一个隔离的文件环境，因此执行效率几乎等同于直接部署在 Linux 主机上。

这意味着：Docker 必须运行在 Linux 内核的系统上。如果要在 Windows 或 macOS 上使用 Docker，就需要先创建一个 Linux 虚拟机，再在里面运行 Docker。对于 Windows 10/11 用户，官方推荐使用 Docker Desktop，它会在后台自动创建一个轻量级 Linux 虚拟机（基于 WSL 2），让你无需手动配置即可使用 Docker。

## 二、系统要求

| 项目 | 要求 |
|------|------|
| 操作系统 | Windows 10 / Windows 11 |
| 系统版本 | 专业版、企业版、教育版（部分家庭版也支持，需开启 WSL 2） |
| 必备组件 | 开启 WSL 2（Windows Subsystem for Linux） |
| 硬件虚拟化 | BIOS/UEFI 中开启虚拟化支持 |

## 三、安装步骤

### 3.1 启用 WSL 2

以管理员身份打开 PowerShell，执行以下命令：

```powershell
wsl --install
```

该命令会自动启用"适用于 Linux 的 Windows 子系统"和"虚拟机平台"功能，并安装 Ubuntu 发行版。安装完成后需要重启电脑。

#### 验证 WSL 环境

重启后，在命令行执行：

```powershell
wsl -l
```

如果列表为空，可以手动安装 Ubuntu：

```powershell
wsl --install -d Ubuntu
```

### 3.2 下载 Docker Desktop

访问 Docker 官方下载页面下载 Windows 版本：

```
https://docs.docker.com/desktop/install/windows-install/
```

如果未登录，会提示注册或登录 Docker Hub（免费）。下载后得到 `Docker Desktop Installer.exe` 安装文件。

### 3.3 运行安装程序

双击下载的安装文件，一路点击 Next，最后点击 Finish 完成安装。安装过程中确保勾选 **"Use WSL 2 instead of Hyper-V"** 选项。

### 3.4 重启电脑

安装完成后，建议重启电脑，确保所有组件生效。

### 3.5 启动 Docker Desktop

在 Windows 搜索栏输入 Docker，找到 Docker Desktop 并启动。启动成功后，任务栏通知区域会出现一个小鲸鱼图标，表示 Docker 正在运行。

## 四、配置镜像加速器（推荐）

使用国内镜像加速器可以显著提升连接稳定性。配置方法如下：

1. 打开 Docker Desktop
2. 点击任务栏小鲸鱼图标 → Settings
3. 选择 Docker Engine
4. 在配置文件中添加镜像加速器地址（如下示例），然后点击 Apply & Restart

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://dockerproxy.com",
    "https://docker.nju.edu.cn"
  ]
}
```

## 五、验证安装

打开命令行（CMD 或 PowerShell），执行以下命令检查 Docker 版本：

```bash
docker version
```

如果看到 Client 和 Server 的版本信息，说明 Docker 已正常运行。接着运行测试镜像：

```bash
docker run hello-world
```

如果看到 "Hello from Docker!" 的欢迎信息，恭喜你，安装成功！

## 六、常见问题与解决方案

### 6.1 WSL 2 报错 0x800701bc

**错误信息：** `WslRegisterDistribution failed with error: 0x800701bc`

这表示分配 WSL2 内核失败，通常是由于 Windows 更新或安装 WSL 时出现问题引起的。

**解决方案（打开 PowerShell 执行）：**

```powershell
wsl --update
```

这是最简单有效的解决方法。如果上述方法无效，可以尝试以下补充操作：

1. 以管理员身份运行：
   ```powershell
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```
2. 重启电脑
3. 下载并安装 WSL2 内核更新包：https://aka.ms/wsl2kernel

### 6.2 其他常见问题

| 问题现象 | 解决方法 |
|----------|----------|
| Docker 无法启动 | 检查是否已开启 WSL 2，执行 `wsl --set-default-version 2` |
| 提示"未找到 WSL" | 以管理员身份运行 PowerShell，执行 `wsl --install` |
| 小鲸鱼图标不显示 | 手动从开始菜单启动 Docker Desktop |
| 拉取镜像超时 | 配置国内镜像加速器（参见第四章） |

## 七、参考来源

- 《【Docker】Windows 安装 Docker 简明指南》— CSDN 博客
- 《Win11 安装 WSL2 报错 0x800701bc 解决方案》— CSDN 博客
- Docker 官方文档：https://docs.docker.com/desktop/install/windows-install/
