---
title: "Hugo 入门指南"
date: 2026-05-28T11:00:00+08:00
draft: false
description: "Hugo 静态站点生成器快速入门"
categories: ["技术"]
tags: ["Hugo", "教程", "静态站点"]
author: ""
showToc: true
TocOpen: false
---

Hugo 是一个用 Go 语言编写的静态站点生成器，以其极快的构建速度而闻名。⚡

## 安装 Hugo

```bash
# Windows (使用 winget)
winget install Hugo.Hugo.Extended

# macOS (使用 Homebrew)
brew install hugo

# Linux (使用 Snap)
snap install hugo
```

## 创建新站点

```bash
hugo new site my-blog
cd my-blog
```

## 安装主题

```bash
git init
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

## 创建文章

```bash
hugo new content posts/my-first-post.md
```

## 本地预览

```bash
hugo server -D
```

访问 `http://localhost:1313` 查看效果。👀

## 构建站点

```bash
hugo --minify
```

生成的静态文件在 `public` 目录中。📦

## 总结

Hugo 是一个强大而快速的静态站点生成器，非常适合搭建个人博客。🎯
