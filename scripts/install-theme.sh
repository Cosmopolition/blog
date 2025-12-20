#!/bin/bash

# PaperMod主题安装脚本

echo "正在安装PaperMod主题..."

# 方法1: 使用git submodule（推荐）
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod

# 如果方法1失败，使用方法2: 直接克隆
if [ ! -d "themes/PaperMod" ]; then
    echo "方法1失败，尝试直接克隆..."
    git clone --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
fi

if [ -d "themes/PaperMod" ]; then
    echo "✅ PaperMod主题安装成功！"
else
    echo "❌ 主题安装失败，请检查网络连接或手动下载主题"
fi

