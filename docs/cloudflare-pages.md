# Cloudflare Pages 部署指南

## 部署步骤

### 1. 准备Git仓库

确保代码已推送到GitHub或GitLab：

```bash
git init
git add .
git commit -m "Initial commit: Hugo blog"
git branch -M main
git remote add origin https://github.com/yourusername/my-blog.git
git push -u origin main
```

### 2. 在Cloudflare Pages中创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** 部分
3. 点击 **"Create a project"**
4. 选择 **"Connect to Git"**
5. 授权并选择你的Git仓库

### 3. 配置构建设置

在Cloudflare Pages的构建设置中配置：

- **Framework preset**: `Hugo`
- **Build command**: `hugo --minify`
- **Build output directory**: `public`
- **Root directory**: `/` (留空)

### 4. 环境变量（可选）

如果需要指定Hugo版本，可以添加环境变量：

- **Variable name**: `HUGO_VERSION`
- **Value**: `0.120.0` (或最新版本)

### 5. 保存并部署

点击 **"Save and Deploy"**，等待构建完成。

### 6. 配置自定义域名

1. 在项目设置中进入 **"Custom domains"**
2. 点击 **"Set up a custom domain"**
3. 输入你的域名（如：`blog.yourdomain.com`）
4. Cloudflare会自动配置DNS和SSL证书

### 7. 更新baseURL

部署成功后，更新 `config.yaml` 中的 `baseURL` 为实际域名：

```yaml
baseURL: 'https://blog.yourdomain.com'
```

然后提交并推送：

```bash
git add config.yaml
git commit -m "Update baseURL"
git push
```

## 自动部署

每次推送到 `main` 分支，Cloudflare Pages会自动：
1. 检测代码变更
2. 运行构建命令
3. 部署到全球CDN
4. 更新网站内容

## 构建日志

如果构建失败，可以在Cloudflare Pages的构建日志中查看详细错误信息。

## 常见问题

### 构建失败：找不到主题

**解决方案**：
1. 确保主题已正确安装
2. 如果使用git submodule，确保在Cloudflare Pages中启用submodule支持
3. 或者直接将主题文件提交到仓库

### 样式丢失

**解决方案**：
1. 检查 `config.yaml` 中的 `theme: PaperMod` 配置
2. 确认主题文件存在于 `themes/PaperMod` 目录

### 域名无法访问

**解决方案**：
1. 检查DNS配置是否正确
2. 等待SSL证书生效（最多24小时）
3. 确认Cloudflare Pages域名配置正确

