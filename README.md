# 个人博客

基于 Hugo + Cloudflare Pages 的静态博客。

## 🚀 快速开始

### 本地开发

```bash
# 启动本地服务器
hugo server -D

# 访问 http://localhost:1313
```

### 创建新文章

```bash
hugo new posts/my-article.md
```

### 构建静态文件

```bash
hugo --minify
```

## 📁 项目结构

```
blog/
├── archetypes/      # 文章模板
├── content/         # 内容目录
│   └── posts/      # 文章目录
├── static/          # 静态资源（图片、文件等）
├── themes/          # 主题目录
│   └── PaperMod/   # PaperMod主题
├── config.yaml      # Hugo配置文件
├── docs/            # 文档目录（搭建过程文档）
└── scripts/         # 工具脚本
```

## ⚙️ 配置

编辑 `config.yaml` 修改博客配置：
- `baseURL` - 博客域名
- `title` - 博客标题
- `description` - 博客描述
- `params.socialIcons` - 社交链接

## 🚀 部署

本项目使用 Cloudflare Pages 进行部署。

### 快速部署

**三步完成部署：**
1. 提交代码到GitHub
2. 在Cloudflare Pages中连接仓库
3. 配置自定义域名

详细步骤请参考：
- [快速部署指南](./快速部署指南.md) - 5分钟快速部署 ⚡
- [完整部署流程.md](./完整部署流程.md) - 详细步骤和问题解决 📚
- [docs/cloudflare-pages.md](./docs/cloudflare-pages.md) - 部署文档

## 📚 文档

搭建过程中的文档和指南位于 `docs/` 目录：
- [博客搭建方案](./docs/博客搭建方案.md)
- [快速开始指南](./docs/快速开始指南.md)
- [部署指南](./docs/cloudflare-pages.md)

## 🔗 相关资源

- [Hugo 官方文档](https://gohugo.io/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [PaperMod 主题](https://github.com/adityatelange/hugo-PaperMod)

---

**开始写作吧！** ✨
