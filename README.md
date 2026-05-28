# Anfinsen's Blog

我的个人博客，使用 Hugo 搭建，部署在 GitHub Pages 上。

## 技术栈

- **框架**: Hugo
- **主题**: PaperMod
- **部署**: GitHub Pages

## 本地运行

```bash
# 安装 Hugo
winget install Hugo.Hugo.Extended

# 克隆仓库
git clone https://github.com/AnfinsenYu/Anfinsen-s-Blog.git
cd Anfinsen-s-Blog

# 初始化子模块
git submodule update --init --recursive

# 启动本地服务器
hugo server -D
```

访问 http://localhost:1313 查看效果。

## 写新文章

```bash
hugo new content posts/my-new-post.md
```

## 许可证

MIT License
