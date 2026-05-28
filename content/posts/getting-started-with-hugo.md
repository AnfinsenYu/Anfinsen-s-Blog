---
title: "从零开始搭建 Hugo 个人博客：完整实战指南"
date: 2026-05-28T11:00:00+08:00
draft: false
description: "从安装到部署，手把手教你用 Hugo + PaperMod + GitHub Pages 搭建个人博客"
categories: ["技术"]
tags: ["Hugo", "教程", "GitHub Pages", "博客搭建"]
author: ""
showToc: true
TocOpen: true
cover:
  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800"
  alt: "Coding"
  caption: "Photo by Ilya Pavlov on Unsplash"
  relative: false
---

这是一篇基于真实搭建过程的 Hugo 博客教程，记录了从零开始到部署上线的完整流程。🚀

## 一、Hugo 简介 ⚡

Hugo 是一个用 Go 语言编写的静态站点生成器，以其极快的构建速度而闻名。相比其他静态站点生成器（如 Jekyll、Hexo），Hugo 具有以下优势：

- ⚡ **极致速度**：毫秒级构建，即使有上千篇文章
- 🎨 **丰富的主题**：官方主题库有 300+ 精美主题
- 📝 **灵活的内容管理**：支持 Markdown、分类、标签等
- 🌍 **多语言支持**：内置国际化支持

## 二、环境准备 🛠️

### 2.1 安装 Hugo

```bash
# Windows (使用 winget)
winget install Hugo.Hugo.Extended

# macOS (使用 Homebrew)
brew install hugo

# Linux (使用 Snap)
snap install hugo
```

验证安装：

```bash
hugo version
```

### 2.2 安装 Git

Hugo 需要 Git 来管理主题和部署。如果还没有安装：

```bash
# Windows
winget install Git.Git

# macOS
brew install git
```

## 三、创建博客项目 📁

### 3.1 初始化站点

```bash
hugo new site my-blog
cd my-blog
```

这会创建如下目录结构：

```
my-blog/
├── archetypes/     # 文章模板
├── assets/         # 资源文件（CSS、JS 等）
├── content/        # 内容文件
├── data/           # 数据文件
├── i18n/           # 国际化文件
├── layouts/        # 布局模板
├── static/         # 静态文件（图片等）
├── themes/         # 主题目录
└── hugo.toml       # 配置文件
```

### 3.2 初始化 Git 仓库

```bash
git init
```

### 3.3 安装 PaperMod 主题

PaperMod 是一个简洁、快速、功能丰富的 Hugo 主题：

```bash
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

## 四、配置博客 ⚙️

### 4.1 基础配置

编辑 `hugo.toml`：

```toml
baseURL = 'https://yourusername.github.io/your-repo-name/'
locale = 'zh-cn'
title = '我的博客'
theme = 'PaperMod'

[params]
  defaultTheme = "auto"          # 自动切换明暗主题
  ShowReadingTime = true         # 显示阅读时间
  ShowShareButtons = true        # 显示分享按钮
  ShowCodeCopyButtons = true     # 代码复制按钮
  ShowPostNavLinks = true        # 文章导航链接
  ShowBreadCrumbs = true         # 面包屑导航
  ShowToc = true                 # 目录

[params.homeInfoParams]
  Title = "欢迎来到我的博客 ✨"
  Content = "分享技术、生活与思考 🚀"
```

### 4.2 配置导航菜单

```toml
[[menu.main]]
  identifier = "posts"
  name = "📝 文章"
  url = "/posts/"
  weight = 10

[[menu.main]]
  identifier = "categories"
  name = "📁 分类"
  url = "/categories/"
  weight = 20

[[menu.main]]
  identifier = "tags"
  name = "🏷️ 标签"
  url = "/tags/"
  weight = 30

[[menu.main]]
  identifier = "archives"
  name = "📦 归档"
  url = "/archives/"
  weight = 40

[[menu.main]]
  identifier = "about"
  name = "👤 关于"
  url = "/about/"
  weight = 50

[[menu.main]]
  identifier = "search"
  name = "🔍 搜索"
  url = "/search/"
  weight = 60
```

### 4.3 启用搜索功能

```toml
[params.search]
  enable = true
  showSearch = true

[outputs]
  home = ["HTML", "RSS", "JSON"]  # JSON 用于搜索
```

### 4.4 配置代码高亮

```toml
[markup]
  [markup.highlight]
    lineNos = true
    style = "monokai"
    codeFences = true
    guessSyntax = true
    noClasses = false
```

## 五、创建内容 📝

### 5.1 创建"关于"页面

```bash
hugo new content about/_index.md
```

编辑 `content/about/_index.md`：

```markdown
---
title: "关于我"
date: 2026-05-28T10:00:00+08:00
draft: false
description: "关于这个博客和作者"
showToc: false
---

## 关于这个博客

这是一个使用 Hugo 搭建的个人博客，记录技术学习和生活思考。📝

## 关于我

你好，我是 AnfinsenYu，一个热爱编程和技术的开发者。👨‍💻

### 技术兴趣

- 🖥️ **后端开发**：喜欢研究系统架构和性能优化
- 🐳 **容器化技术**：Docker、Kubernetes 等云原生技术
- 🛠️ **开发工具**：追求高效的开发工作流
- 💻 **开源项目**：乐于参与和贡献开源社区

## 联系方式

- 🐙 GitHub: [AnfinsenYu](https://github.com/AnfinsenYu)
- 📧 Email: AnfinsenYu@qq.com
```

### 5.2 创建搜索和归档页面

```bash
hugo new content search/_index.md
hugo new content archives/_index.md
```

`content/search/_index.md`：

```markdown
---
title: "搜索"
layout: "search"
placeholder: "搜索文章..."
---
```

`content/archives/_index.md`：

```markdown
---
title: "归档"
layout: "archives"
---
```

### 5.3 写博客文章

```bash
hugo new content posts/my-first-post.md
```

文章头部（Front Matter）：

```markdown
---
title: "文章标题"
date: 2026-05-28T10:00:00+08:00
draft: false
description: "文章简介"
categories: ["技术"]
tags: ["Hugo", "教程"]
author: ""
showToc: true
TocOpen: false
cover:
  image: "https://images.unsplash.com/photo-xxx?w=800"
  alt: "封面图"
  caption: "Photo by xxx on Unsplash"
  relative: false
---
```

## 六、个性化定制 🎨

### 6.1 启用个人资料模式

在 `hugo.toml` 中添加：

```toml
[params.profileMode]
  enabled = true
  title = "AnfinsenYu"
  subtitle = "后端开发 · 容器化技术 · 开源爱好者"
  imageUrl = "/images/avatar.jpg"
  imageWidth = 150
  imageHeight = 150
  imageTitle = "AnfinsenYu"

[[params.profileMode.buttons]]
  name = "📝 文章"
  url = "/posts/"

[[params.profileMode.buttons]]
  name = "👤 关于"
  url = "/about/"

[[params.socialIcons]]
  name = "github"
  url = "https://github.com/yourusername"
```

### 6.2 添加头像

将头像图片放到 `static/images/avatar.jpg`，建议使用正方形图片。

### 6.3 自定义样式

创建 `assets/css/extended/custom.css`：

```css
/* 自定义主题样式 */
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 头像样式 */
.profile-mode .profile-img {
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.profile-mode .profile-img:hover {
  transform: scale(1.05);
}

/* 标题渐变 */
.profile-mode .profile-title {
  font-size: 2rem;
  font-weight: 700;
  background: var(--bg-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 按钮样式 */
.profile-mode .button-group a {
  background: var(--primary-color);
  color: #fff;
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.profile-mode .button-group a:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}
```

### 6.4 添加访问统计

创建 `layouts/partials/extend_footer.html`：

```html
<!-- 不蒜子访问统计 -->
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
<div style="text-align: center; padding: 10px 0; font-size: 0.85rem; color: var(--secondary);">
  <span id="busuanzi_container_site_pv">
    📊 本站总访问量 <span id="busuanzi_value_site_pv"></span> 次
  </span>
  <span style="margin: 0 10px;">|</span>
  <span id="busuanzi_container_site_uv">
    👥 本站访客数 <span id="busuanzi_value_site_uv"></span> 人
  </span>
</div>
```

## 七、本地预览 👀

```bash
hugo server -D
```

访问 `http://localhost:1313` 查看效果。`-D` 参数表示包含草稿文章。

## 八、部署到 GitHub Pages 🌐

### 8.1 创建 GitHub 仓库

1. 在 GitHub 上创建新仓库，名称为 `yourusername.github.io` 或任意名称
2. 如果使用任意名称，部署地址将是 `https://yourusername.github.io/repo-name/`

### 8.2 配置 baseURL

在 `hugo.toml` 中设置：

```toml
baseURL = 'https://yourusername.github.io/repo-name/'
```

### 8.3 创建 GitHub Actions 工作流

创建 `.github/workflows/hugo.yml`：

```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.147.0
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb

      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Build with Hugo
        env:
          HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
          HUGO_ENVIRONMENT: production
        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/"

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 8.4 启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 保存

### 8.5 推送代码

```bash
git add -A
git commit -m "Initial commit: Hugo blog with PaperMod"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

推送后，GitHub Actions 会自动构建和部署。等待 1-2 分钟，访问 `https://yourusername.github.io/repo-name/` 即可看到你的博客。

## 九、日常写作流程 ✍️

### 9.1 创建新文章

```bash
hugo new content posts/my-new-post.md
```

### 9.2 编辑文章

编辑 `content/posts/my-new-post.md`，设置 `draft: false`。

### 9.3 本地预览

```bash
hugo server -D
```

### 9.4 发布

```bash
git add -A
git commit -m "Add new post: my-new-post"
git push
```

GitHub Actions 会自动重新部署。

## 十、常用命令速查 📋

| 命令 | 说明 |
|------|------|
| `hugo new site my-blog` | 创建新站点 |
| `hugo new content posts/post.md` | 创建新文章 |
| `hugo server -D` | 本地预览（含草稿） |
| `hugo --minify` | 构建生产版本 |
| `git submodule update --init` | 初始化主题子模块 |

## 总结 🎯

通过这篇指南，你已经学会了：

1. ✅ 安装 Hugo
2. ✅ 创建博客项目
3. ✅ 安装和配置 PaperMod 主题
4. ✅ 创建各类页面（关于、搜索、归档）
5. ✅ 撰写博客文章
6. ✅ 个性化定制（头像、样式、统计）
7. ✅ 部署到 GitHub Pages

Hugo 是一个强大而快速的静态站点生成器，配合 PaperMod 主题和 GitHub Pages，你可以轻松搭建一个美观、高效的个人博客。

Happy blogging! 🎉
