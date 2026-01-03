#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 简单的ImgBB上传测试脚本

console.log('🧪 ImgBB上传工具测试');
console.log('=' .repeat(40));

// 读取.env文件
function loadEnvFile() {
  const envFiles = ['.env', 'test.env'];

  for (const envFile of envFiles) {
    try {
      if (fs.existsSync(envFile)) {
        const envContent = fs.readFileSync(envFile, 'utf8');
        const lines = envContent.split('\n');
        const env = {};

        lines.forEach(line => {
          const match = line.match(/^([^=]+)=(.*)$/);
          if (match) {
            env[match[1].trim()] = match[2].trim();
          }
        });

        console.log(`✅ 已从 ${envFile} 加载环境变量`);
        return env;
      }
    } catch (error) {
      console.log(`⚠️  读取${envFile}文件失败:`, error.message);
    }
  }

  return {};
}

// 检查环境变量
const envFromFile = loadEnvFile();
const apiKey = process.env.IMGBB_API_KEY || envFromFile.IMGBB_API_KEY;
if (!apiKey) {
  console.error('❌ 未设置 IMGBB_API_KEY 环境变量');
  console.log('   请先运行: npm run setup');
  process.exit(1);
}

console.log('✅ API Key已配置');

// 检查图片目录
const imageDir = 'static/images/posts';
if (!fs.existsSync(imageDir)) {
  console.error(`❌ 图片目录不存在: ${imageDir}`);
  process.exit(1);
}

// 扫描图片文件
function scanImages() {
  const images = [];
  const folders = ['hanggang-park', 'mengma-camp', 'jiaqiao-old-street'];

  folders.forEach(folder => {
    const folderPath = path.join(imageDir, folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      files.forEach(file => {
        if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
          images.push(path.join(folder, file));
        }
      });
    }
  });

  return images;
}

const images = scanImages();
console.log(`📁 发现 ${images.length} 张图片:`);
images.forEach(img => console.log(`   - ${img}`));

// 检查映射文件
const mappingFile = 'image-mapping.json';
let existingMapping = {};
if (fs.existsSync(mappingFile)) {
  try {
    existingMapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
    console.log(`📋 现有映射: ${Object.keys(existingMapping).length} 张图片`);
  } catch (error) {
    console.error('❌ 映射文件格式错误:', error.message);
  }
}

// 计算待上传图片
const toUpload = images.filter(img => !existingMapping[img]);
console.log(`📤 待上传: ${toUpload.length} 张图片`);

if (toUpload.length > 0) {
  console.log('\n🚀 准备上传的图片:');
  toUpload.forEach(img => console.log(`   - ${img}`));
  console.log('\n💡 运行以下命令开始上传:');
  console.log('   npm run upload');
} else {
  console.log('🎉 所有图片都已上传完毕！');
}

console.log('\n📖 更多信息请查看: IMGBB-UPLOAD-README.md');
