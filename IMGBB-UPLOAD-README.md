# 🖼️ ImgBB图片上传工具

自动将博客图片上传到ImgBB图床，解决仓库大小和CDN访问问题。

## 🚀 快速开始

### 1. 获取ImgBB API Key

1. 访问 [ImgBB API](https://api.imgbb.com/)
2. 注册账户并获取API Key
3. 每月免费额度：250张图片上传

### 2. 配置环境变量

**方法一：创建.env文件（推荐）**

```bash
# 手动创建.env文件
touch .env

# 编辑.env文件，添加以下内容：
echo "IMGBB_API_KEY=your_actual_api_key_here" > .env
```

**方法二：直接设置环境变量**

```bash
# 临时设置（当前终端会话）
export IMGBB_API_KEY=your_actual_api_key_here

# 永久设置（添加到shell配置文件）
echo 'export IMGBB_API_KEY=your_actual_api_key_here' >> ~/.zshrc
source ~/.zshrc
```

**方法三：运行时指定**

```bash
# 直接在命令中指定
IMGBB_API_KEY=your_actual_api_key_here npm run upload
```

> ⚠️ **重要**：`.env`文件已被.gitignore忽略，不会上传到Git仓库

### 3. 安装依赖

```bash
npm install
```

### 4. 测试脚本（可选）

```bash
# 检查脚本是否正常工作
node upload-images.js --help
```

### 5. 上传图片

```bash
# 上传所有图片到ImgBB
npm run upload

# 或者直接运行脚本
node upload-images.js
```

## ⚙️ Hugo配置

### 生产环境配置

上传完成后，修改 `config.yaml`：

```yaml
params:
  images:
    useCDN: true  # 设为true启用ImgBB CDN
```

### 开发环境配置

本地开发时保持：

```yaml
params:
  images:
    useCDN: false  # 设为false使用本地图片
```

## 📋 功能特性

- ✅ **批量上传** - 自动扫描static/images/posts目录
- ✅ **断点续传** - 跳过已上传的图片
- ✅ **并发控制** - 避免API限制
- ✅ **自动重试** - 网络错误自动重试
- ✅ **映射记录** - 保存上传记录到image-mapping.json
- ✅ **进度显示** - 实时显示上传进度

## 🔧 配置选项

编辑 `upload-images.js` 中的 CONFIG 对象：

```javascript
const CONFIG = {
  imgbbApiKey: process.env.IMGBB_API_KEY,
  imageDir: 'static/images/posts',        // 图片目录
  mappingFile: 'image-mapping.json',      // 映射文件
  maxConcurrency: 3,                      // 并发数量
  retryAttempts: 3,                       // 重试次数
  retryDelay: 1000                        // 重试延迟(ms)
};
```

## 📊 使用流程

1. **本地测试** - 使用本地图片
2. **上传到ImgBB** - 运行上传脚本
3. **更新配置** - 设置 `useCDN: true`
4. **部署生产** - 使用CDN图片

## 📁 输出文件

- `image-mapping.json` - 图片映射记录
- 控制台输出 - 上传进度和结果

## 🛠️ 故障排除

### API Key错误
```
❌ 请设置环境变量 IMGBB_API_KEY
```
**解决**：确保.env文件存在且IMGBB_API_KEY已设置

### 网络超时
```
❌ 上传失败: timeout
```
**解决**：检查网络连接，脚本会自动重试

### 图片格式不支持
```
⚠️ 跳过不支持的文件: image.webp
```
**解决**：ImgBB支持 jpg/jpeg/png/gif格式

## 🔄 工作原理

1. **扫描图片** - 查找static/images/posts目录下的图片
2. **检查映射** - 查看哪些图片已经上传
3. **批量上传** - 并发上传到ImgBB
4. **记录映射** - 保存URL映射关系
5. **更新配置** - Hugo使用CDN图片

## 📈 性能优化

- **并发控制** - 避免API限制
- **智能重试** - 网络错误自动处理
- **增量上传** - 只上传新图片
- **映射缓存** - 本地记录上传状态

## 💡 最佳实践

1. **先本地测试** - 确保图片正常显示
2. **批量上传** - 一次性上传所有图片
3. **定期清理** - 删除本地图片节省空间
4. **备份映射** - 保存image-mapping.json

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License
