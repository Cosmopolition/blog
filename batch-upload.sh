#!/bin/bash

# 批量上传图片到ImgBB
set -e

# 配置
IMAGE_DIR="static/images/posts"
MAPPING_FILE="image-mapping.json"
UPLOAD_SCRIPT="./simple-upload.sh"

# 检查API Key
if [ -z "$IMGBB_API_KEY" ]; then
    echo "❌ 请设置环境变量 IMGBB_API_KEY"
    echo "   export IMGBB_API_KEY=your_api_key_here"
    exit 1
fi

# 检查上传脚本
if [ ! -x "$UPLOAD_SCRIPT" ]; then
    echo "❌ 上传脚本不存在或不可执行: $UPLOAD_SCRIPT"
    exit 1
fi

# 检查图片目录
if [ ! -d "$IMAGE_DIR" ]; then
    echo "❌ 图片目录不存在: $IMAGE_DIR"
    exit 1
fi

echo "🎨 ImgBB批量上传工具"
echo "===================="

# 读取现有映射
declare -A existing_mapping
if [ -f "$MAPPING_FILE" ]; then
    echo "📋 读取现有映射文件..."
    # 这里可以添加JSON解析逻辑，但为了简单，我们先跳过
fi

# 扫描图片文件
echo "🔍 扫描图片文件..."
image_files=()
while IFS= read -r -d '' file; do
    image_files+=("$file")
done < <(find "$IMAGE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \) -print0)

if [ ${#image_files[@]} -eq 0 ]; then
    echo "⚠️  未找到任何图片文件"
    exit 0
fi

echo "📁 发现 ${#image_files[@]} 张图片"

# 创建临时映射文件
temp_mapping="{}"

# 上传图片
success_count=0
fail_count=0

for image_file in "${image_files[@]}"; do
    # 获取相对路径
    relative_path="${image_file#$IMAGE_DIR/}"

    # 检查是否已上传（简化检查）
    if [ -f "$MAPPING_FILE" ] && grep -q "$relative_path" "$MAPPING_FILE"; then
        echo "⏭️  跳过已上传: $relative_path"
        continue
    fi

    echo "⬆️  上传中: $relative_path"

    # 调用上传脚本
    if $UPLOAD_SCRIPT "$image_file" "$IMGBB_API_KEY" 2>/dev/null; then
        echo "✅ 成功: $relative_path"
        ((success_count++))
    else
        echo "❌ 失败: $relative_path"
        ((fail_count++))
    fi

    # 避免API限制，添加延迟
    sleep 1
done

# 输出统计
echo ""
echo "===================="
echo "📊 上传完成"
echo "✅ 成功: $success_count"
if [ $fail_count -gt 0 ]; then
    echo "❌ 失败: $fail_count"
fi
echo "📁 总计: ${#image_files[@]}"

# 提醒用户更新映射文件
echo ""
echo "💡 请手动更新 $MAPPING_FILE 文件，记录上传成功的图片URL"
echo "   格式参考现有的JSON结构"
