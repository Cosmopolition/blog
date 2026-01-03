#!/bin/bash

# 简单的ImgBB上传脚本 (使用curl)
# 用法: ./simple-upload.sh <图片路径> [API_KEY]

set -e

# 默认配置
DEFAULT_API_KEY="${IMGBB_API_KEY:-}"
API_KEY="${2:-$DEFAULT_API_KEY}"

# 检查参数
if [ $# -lt 1 ]; then
    echo "用法: $0 <图片路径> [API_KEY]"
    echo "或者设置环境变量: export IMGBB_API_KEY=your_key"
    exit 1
fi

IMAGE_PATH="$1"

# 检查API Key
if [ -z "$API_KEY" ]; then
    echo "❌ 请提供API Key"
    echo "   方法1: $0 <图片路径> <API_KEY>"
    echo "   方法2: export IMGBB_API_KEY=your_key"
    exit 1
fi

# 检查文件是否存在
if [ ! -f "$IMAGE_PATH" ]; then
    echo "❌ 文件不存在: $IMAGE_PATH"
    exit 1
fi

echo "🖼️  上传图片: $IMAGE_PATH"
echo "🔑 使用API Key: ${API_KEY:0:8}..."

# 使用curl上传到ImgBB
RESPONSE=$(curl -s -X POST \
    -F "key=$API_KEY" \
    -F "image=@$IMAGE_PATH" \
    https://api.imgbb.com/1/upload)

# 检查响应
if echo "$RESPONSE" | grep -q '"success":true'; then
    # 提取URL
    URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    DISPLAY_URL=$(echo "$RESPONSE" | grep -o '"display_url":"[^"]*"' | cut -d'"' -f4)

    echo "✅ 上传成功!"
    echo "🌐 URL: $URL"
    echo "🖼️  Display URL: $DISPLAY_URL"

    # 输出JSON格式的结果，用于脚本处理
    echo "{\"success\":true,\"url\":\"$URL\",\"display_url\":\"$DISPLAY_URL\",\"file\":\"$IMAGE_PATH\"}" > /dev/null
else
    ERROR=$(echo "$RESPONSE" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
    echo "❌ 上传失败: ${ERROR:-未知错误}"
    echo "完整响应: $RESPONSE"
    exit 1
fi
