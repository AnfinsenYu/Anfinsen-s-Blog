# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Hugo 个人博客项目（AnBlog），使用 PaperMod 主题，部署在 GitHub Pages。

- **仓库地址**：https://github.com/AnfinsenYu/Anfinsen-s-Blog
- **部署地址**：https://anfinsenyu.github.io/Anfinsen-s-Blog/
- **技术栈**：Hugo + PaperMod 主题 + GitHub Actions 自动构建

## Build & Development

```bash
# 本地预览
cd blog
hugo server

# 构建
hugo

# 部署（推送到 GitHub 后自动构建）
git add .
git commit -m "feat: your message"
git push
```

## Architecture

```
blog/
├── content/
│   └── posts/
│       ├── FIFA/           # FIFA 世界杯专题（13篇文章）
│       │   ├── _index.md   # 专题主页
│       │   ├── 2026-worldcup-guide/
│       │   ├── death-group/
│       │   ├── full-prediction/
│       │   ├── injury-intel/
│       │   ├── opening-day-prediction/
│       │   ├── match-review-france-iraq/
│       │   ├── match-review-round1-2/
│       │   ├── match-review-round3/
│       │   ├── match-review-round4/
│       │   ├── match-review-round5/
│       │   ├── match-review-round6/
│       │   ├── match-review-round7/
│       │   └── match-review-round8/  # 最新：K/L组第2轮
│       └── ...             # 其他文章
├── layouts/                # 自定义布局
├── assets/                 # 自定义资源
├── static/                 # 静态资源
└── hugo.toml               # Hugo 配置
```

### 关键配置

- `buildFuture = true`：允许发布未来日期文章
- 主页模式：profileMode（左侧文字 + 右侧头像）
- 头像位置：`assets/images/avatar.jpg`（PaperMod resources.Get 要求）
- 代码高亮：monokai 样式
- 分页配置：`[pagination] pagersize = 50`

### 世界杯专题工作流

1. **赛程验证**：查直播吧/小红书获取真实赛程
⚠️ 必须严格验证赛程，避免虚构比赛（参考 [[no-fake-matches]] 记忆条目）
2. **模型预测**：V2权重独立预测（不参考高僧/YOYO）
3. **信息收集**：抓取比赛数据和图片（压缩到200KB以内）
4. **文章生成**：按模板生成复盘文章
5. **发布**：更新记忆文件 + 推送 GitHub

### 注意事项

- 图片命名：英文 + 小写 + 连字符（如 `messi-goal.jpg`）
- Page Bundle：有图片的文章用目录结构（index.md + images/）
- 敏感信息：文章中不要放真实 API Key、密码、公司名
- 中文文件名：可能导致页面不生成，建议用英文
- 半角波浪号 `~`：用全角 `～` 替代，避免渲染为横线
