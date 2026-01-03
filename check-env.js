#!/usr/bin/env node

// 环境配置检查脚本
const fs = require('fs');
const path = require('path');

console.log('🔍 环境配置检查');
console.log('=' .repeat(30));

// 检查.env文件
const envPath = path.join(process.cwd(), '.env');
let envExists = false;
let apiKeyConfigured = false;

if (fs.existsSync(envPath)) {
  envExists = true;
  console.log('✅ .env文件存在');

  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('IMGBB_API_KEY=') && !envContent.includes('your_imgbb_api_key_here')) {
      apiKeyConfigured = true;
      console.log('✅ API Key已配置');
    } else {
      console.log('❌ API Key未配置或使用示例值');
    }
  } catch (error) {
    console.log('❌ 无法读取.env文件');
  }
} else {
  console.log('❌ .env文件不存在');
}

// 检查.gitignore
const gitignorePath = path.join(process.cwd(), '.gitignore');
let envIgnored = false;

if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (gitignoreContent.includes('.env')) {
    envIgnored = true;
    console.log('✅ .env文件已被.gitignore忽略');
  } else {
    console.log('⚠️  .env文件未被.gitignore忽略');
  }
} else {
  console.log('⚠️  .gitignore文件不存在');
}

// 检查图片目录
const imageDir = 'static/images/posts';
let imageDirExists = false;
let imageCount = 0;

if (fs.existsSync(imageDir)) {
  imageDirExists = true;
  console.log('✅ 图片目录存在');

  // 递归统计图片数量
  function countImages(dir) {
    let count = 0;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        count += countImages(fullPath);
      } else if (item.match(/\.(jpg|jpeg|png|gif)$/i)) {
        count++;
      }
    }
    return count;
  }

  imageCount = countImages(imageDir);
  console.log(`📁 发现 ${imageCount} 张图片`);
} else {
  console.log('❌ 图片目录不存在');
}

// 检查映射文件
const mappingFile = 'image-mapping.json';
let mappingExists = false;
let mappedCount = 0;

if (fs.existsSync(mappingFile)) {
  mappingExists = true;
  try {
    const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
    mappedCount = Object.keys(mapping).length;
    console.log(`📋 映射文件存在，已映射 ${mappedCount} 张图片`);
  } catch (error) {
    console.log('❌ 映射文件格式错误');
  }
} else {
  console.log('📋 映射文件不存在（首次运行时正常）');
}

// 总结
console.log('\n📊 配置状态总结:');
console.log(`   环境文件: ${envExists ? '✅' : '❌'} ${envIgnored ? '(已忽略)' : '(未忽略)'}`);
console.log(`   API密钥: ${apiKeyConfigured ? '✅' : '❌'}`);
console.log(`   图片目录: ${imageDirExists ? '✅' : '❌'} (${imageCount} 张图片)`);
console.log(`   映射文件: ${mappingExists ? '✅' : '❌'} (${mappedCount} 张已映射)`);

const allGood = envExists && apiKeyConfigured && imageDirExists;
if (allGood) {
  console.log('\n🎉 配置完成！运行以下命令开始上传:');
  console.log('   npm run upload');
} else {
  console.log('\n⚠️  配置不完整，请运行:');
  console.log('   npm run setup    # 配置API Key');
}

console.log('\n📖 详细说明: IMGBB-UPLOAD-README.md');
