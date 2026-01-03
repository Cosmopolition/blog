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

### 🖼️ 图片上传到ImgBB (推荐方案)

解决仓库大小和CDN访问问题，绕过Cloudflare+中国CDN限制：

#### 🚀 快速开始 (3步完成)

```bash
# 1. 配置ImgBB API Key (交互式设置)
npm run setup

# 2. 测试配置和查看待上传图片
npm run test

# 3. 上传所有图片到ImgBB
npm run upload

# 4. 启用CDN (修改config.yaml)
# 将 params.images.useCDN 设为 true
```

#### 🛠️ 手动配置 (如果需要)

```bash
# 创建.env文件
echo "IMGBB_API_KEY=your_api_key_here" > .env

# 或者直接设置环境变量
export IMGBB_API_KEY=your_api_key_here
```

#### 🔄 备用方案 (不需要额外依赖)

```bash
# 使用纯bash脚本
export IMGBB_API_KEY=your_api_key_here
./batch-upload.sh
```

#### 📊 使用流程

1. **本地开发**: `useCDN: false` (使用本地图片)
2. **获取API Key**: 访问 [ImgBB API](https://api.imgbb.com/)
3. **配置环境**: 运行 `npm run setup`
4. **上传图片**: 运行 `npm run upload`
5. **启用CDN**: 修改config.yaml启用ImgBB
6. **部署上线**: 图片自动使用CDN地址

详细说明：📖 [IMGBB-UPLOAD-README.md](./IMGBB-UPLOAD-README.md)

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
- [博客分类说明](./docs/博客分类说明.md) - 分类体系和使用指南

## 🔗 相关资源

- [Hugo 官方文档](https://gohugo.io/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [PaperMod 主题](https://github.com/adityatelange/hugo-PaperMod)

---

**开始写作吧！** ✨
