# 解决 Homebrew 安装问题

## 当前情况

Homebrew 正在后台安装依赖（portable-ruby），这是安装 Hugo 前的必要步骤。

## 解决方案

### 方案1：等待进程完成（推荐）

brew 正在下载和安装依赖，通常需要几分钟时间。你可以：

1. **等待进程自动完成**
   - 检查进程状态：`ps aux | grep brew | grep -v grep`
   - 如果进程消失，说明已完成

2. **重新尝试安装**
   ```bash
   brew install hugo
   ```

### 方案2：如果进程卡住（超过10分钟）

如果进程长时间不动，可以：

1. **清理锁文件**
   ```bash
   # 删除锁文件
   rm /opt/homebrew/var/homebrew/locks/vendor-install-ruby
   rm /opt/homebrew/var/homebrew/locks/update
   ```

2. **清理brew缓存（可选）**
   ```bash
   brew cleanup
   ```

3. **重新安装**
   ```bash
   brew install hugo
   ```

### 方案3：强制终止并重试（不推荐，除非必要）

如果确实需要强制终止：

```bash
# 查找并终止brew进程
pkill -f "brew.sh"
pkill -f "vendor-install"

# 等待几秒
sleep 3

# 清理锁文件
rm /opt/homebrew/var/homebrew/locks/vendor-install-ruby 2>/dev/null
rm /opt/homebrew/var/homebrew/locks/update 2>/dev/null

# 重新安装
brew install hugo
```

## 检查安装状态

```bash
# 检查Hugo是否已安装
hugo version

# 如果已安装，会显示版本号
```

## 常见问题

### Q: 为什么需要安装portable-ruby？
A: Homebrew 使用 Ruby 来运行脚本，某些包（如 Hugo）需要特定版本的 Ruby。

### Q: 下载很慢怎么办？
A: 可以尝试：
- 使用国内镜像源
- 检查网络连接
- 等待下载完成（通常几分钟）

### Q: 安装失败怎么办？
A: 
1. 检查网络连接
2. 运行 `brew doctor` 检查问题
3. 清理后重试：`brew cleanup && brew install hugo`

