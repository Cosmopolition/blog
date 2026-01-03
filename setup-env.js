#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🔧 ImgBB环境配置助手');
  console.log('=' .repeat(30));

  // 检查是否已有.env文件
  const envPath = path.join(__dirname, '.env');
  let existingKey = '';

  if (fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/IMGBB_API_KEY=(.+)/);
      if (match) {
        existingKey = match[1].trim();
        console.log('📋 发现现有API Key配置');
      }
    } catch (error) {
      console.log('⚠️  读取现有.env文件失败');
    }
  }

  if (existingKey) {
    console.log(`当前API Key: ${existingKey.substring(0, 8)}...`);
    const update = await question('是否要更新API Key? (y/N): ');

    if (update.toLowerCase() !== 'y' && update.toLowerCase() !== 'yes') {
      console.log('✅ 保持现有配置');
      rl.close();
      return;
    }
  }

  console.log('\n📝 获取ImgBB API Key:');
  console.log('   1. 访问: https://api.imgbb.com/');
  console.log('   2. 注册账户并获取API Key');
  console.log('   3. 每月免费额度: 250张图片\n');

  const apiKey = await question('请输入你的ImgBB API Key: ');

  if (!apiKey || apiKey.trim().length === 0) {
    console.log('❌ API Key不能为空');
    rl.close();
    process.exit(1);
  }

  // 保存到.env文件
  const envContent = `IMGBB_API_KEY=${apiKey.trim()}\n`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ API Key已保存到 .env 文件');

    // 创建source脚本
    const sourceScript = path.join(__dirname, 'source-env.sh');
    const sourceContent = `#!/bin/bash\n# 加载环境变量\nexport IMGBB_API_KEY="${apiKey.trim()}"\necho "✅ 环境变量已加载"\n`;
    fs.writeFileSync(sourceScript, sourceContent);
    fs.chmodSync(sourceScript, '755');

    console.log('✅ 已创建 source-env.sh 脚本');

  } catch (error) {
    console.error('❌ 保存失败:', error.message);
    rl.close();
    process.exit(1);
  }

  console.log('\n🚀 配置完成！现在运行以下命令:');
  console.log('');
  console.log('   # 1. 加载环境变量');
  console.log('   source ./source-env.sh');
  console.log('');
  console.log('   # 2. 测试配置');
  console.log('   npm run test');
  console.log('');
  console.log('   # 3. 上传图片');
  console.log('   npm run upload');
  console.log('');
  console.log('💡 提示: 每次新开终端都需要运行 source ./source-env.sh');

  rl.close();
}

main().catch(error => {
  console.error('💥 程序执行出错:', error.message);
  process.exit(1);
});