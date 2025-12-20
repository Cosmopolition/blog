#!/bin/bash

# 检查brew安装状态脚本

echo "🔍 检查Homebrew安装状态..."
echo ""

# 检查brew进程
echo "📊 运行中的brew进程："
ps aux | grep -i "brew\|vendor-install\|portable-ruby" | grep -v grep || echo "  无运行中的进程"
echo ""

# 检查下载文件
echo "📥 下载文件状态："
if [ -f "/Users/moneywang/Library/Caches/Homebrew/portable-ruby-3.4.7.arm64_big_sur.bottle.tar.gz.incomplete" ]; then
    ls -lh /Users/moneywang/Library/Caches/Homebrew/portable-ruby* | tail -1
    echo "  ⏳ 文件正在下载中..."
else
    echo "  ✅ 下载文件不存在（可能已完成）"
fi
echo ""

# 检查锁文件
echo "🔒 锁文件状态："
if [ -f "/opt/homebrew/var/homebrew/locks/vendor-install-ruby" ]; then
    echo "  ⚠️  存在锁文件：vendor-install-ruby"
    ls -lh /opt/homebrew/var/homebrew/locks/vendor-install-ruby
else
    echo "  ✅ 无锁文件"
fi
echo ""

# 检查Hugo是否已安装
echo "🎯 Hugo安装状态："
if command -v hugo &> /dev/null; then
    echo "  ✅ Hugo已安装"
    hugo version
else
    echo "  ❌ Hugo未安装"
    echo ""
    echo "💡 建议："
    if ps aux | grep -i "brew\|vendor-install" | grep -v grep > /dev/null; then
        echo "  - brew进程正在运行，请等待完成"
        echo "  - 完成后运行: brew install hugo"
    else
        echo "  - 可以运行: brew install hugo"
    fi
fi

