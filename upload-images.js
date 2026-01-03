#!/usr/bin/env node

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 配置
const CONFIG = {
  imgbbApiKey: process.env.IMGBB_API_KEY,
  imageDir: 'static/images/posts',
  mappingFile: 'image-mapping.json',
  maxConcurrency: 3, // 同时上传的最大数量
  retryAttempts: 3,
  retryDelay: 1000 // 重试延迟(ms)
};

// 检查API Key
if (!CONFIG.imgbbApiKey) {
  console.error('❌ 请设置环境变量 IMGBB_API_KEY');
  console.error('   获取API Key: https://api.imgbb.com/');
  console.error('   运行命令: export IMGBB_API_KEY=your_api_key_here');
  process.exit(1);
}

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// 读取现有的映射文件
function loadMapping() {
  try {
    if (fs.existsSync(CONFIG.mappingFile)) {
      const data = fs.readFileSync(CONFIG.mappingFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    log(colors.yellow, `⚠️  读取映射文件失败: ${error.message}`);
  }
  return {};
}

// 保存映射文件
function saveMapping(mapping) {
  try {
    fs.writeFileSync(CONFIG.mappingFile, JSON.stringify(mapping, null, 2));
    log(colors.green, `✅ 映射文件已保存: ${CONFIG.mappingFile}`);
  } catch (error) {
    log(colors.red, `❌ 保存映射文件失败: ${error.message}`);
  }
}

// 上传单张图片到ImgBB
async function uploadToImgBB(imagePath, retryCount = 0) {
  try {
    const formData = new FormData();
    formData.append('key', CONFIG.imgbbApiKey);
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders(),
      timeout: 30000, // 30秒超时
    });

    if (response.data.success) {
      return {
        success: true,
        url: response.data.data.url,
        displayUrl: response.data.data.display_url,
        deleteUrl: response.data.data.delete_url,
        thumbUrl: response.data.data.thumb?.url
      };
    } else {
      throw new Error(response.data.error?.message || 'Upload failed');
    }
  } catch (error) {
    if (retryCount < CONFIG.retryAttempts) {
      log(colors.yellow, `⏳ 重试上传 ${path.basename(imagePath)} (${retryCount + 1}/${CONFIG.retryAttempts})`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay * (retryCount + 1)));
      return uploadToImgBB(imagePath, retryCount + 1);
    }

    return {
      success: false,
      error: error.message,
      path: imagePath
    };
  }
}

// 并发上传图片
async function uploadImagesBatch(imagePaths) {
  const results = [];
  const batches = [];

  // 分批处理
  for (let i = 0; i < imagePaths.length; i += CONFIG.maxConcurrency) {
    batches.push(imagePaths.slice(i, i + CONFIG.maxConcurrency));
  }

  log(colors.blue, `🚀 开始上传 ${imagePaths.length} 张图片，共 ${batches.length} 批次`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    log(colors.cyan, `📦 处理批次 ${i + 1}/${batches.length} (${batch.length} 张图片)`);

    const promises = batch.map(async (imagePath) => {
      const relativePath = path.relative(CONFIG.imageDir, imagePath);
      log(colors.blue, `⬆️  上传中: ${relativePath}`);

      const result = await uploadToImgBB(imagePath);

      if (result.success) {
        log(colors.green, `✅ 成功: ${relativePath}`);
        results.push({
          localPath: relativePath,
          ...result
        });
      } else {
        log(colors.red, `❌ 失败: ${relativePath} - ${result.error}`);
        results.push({
          localPath: relativePath,
          ...result
        });
      }

      return result;
    });

    await Promise.all(promises);

    // 批次间暂停
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// 扫描图片文件
function scanImages() {
  return new Promise((resolve, reject) => {
    glob(`${CONFIG.imageDir}/**/*.{jpg,jpeg,png,gif}`, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

// 主函数
async function main() {
  try {
    log(colors.magenta, '🎨 Hugo博客图片上传工具 (ImgBB)');
    log(colors.magenta, '=' .repeat(40));

    // 检查图片目录
    if (!fs.existsSync(CONFIG.imageDir)) {
      log(colors.red, `❌ 图片目录不存在: ${CONFIG.imageDir}`);
      process.exit(1);
    }

    // 扫描图片文件
    log(colors.blue, '🔍 扫描图片文件...');
    const imagePaths = await scanImages();

    if (imagePaths.length === 0) {
      log(colors.yellow, '⚠️  未找到任何图片文件');
      return;
    }

    log(colors.green, `📁 发现 ${imagePaths.length} 张图片`);

    // 读取现有映射
    const existingMapping = loadMapping();
    const existingCount = Object.keys(existingMapping).length;

    if (existingCount > 0) {
      log(colors.cyan, `📋 现有映射: ${existingCount} 张图片`);
    }

    // 过滤已上传的图片
    const toUpload = imagePaths.filter(imagePath => {
      const relativePath = path.relative(CONFIG.imageDir, imagePath);
      return !existingMapping[relativePath];
    });

    if (toUpload.length === 0) {
      log(colors.green, '🎉 所有图片都已上传完毕！');
      return;
    }

    log(colors.yellow, `📤 待上传: ${toUpload.length} 张图片`);

    // 上传图片
    const results = await uploadImagesBatch(toUpload);

    // 更新映射
    const newMapping = { ...existingMapping };
    let successCount = 0;
    let failCount = 0;

    results.forEach(result => {
      if (result.success) {
        newMapping[result.localPath] = {
          cdnUrl: result.url,
          displayUrl: result.displayUrl,
          deleteUrl: result.deleteUrl,
          thumbUrl: result.thumbUrl,
          uploadedAt: new Date().toISOString()
        };
        successCount++;
      } else {
        failCount++;
      }
    });

    // 保存映射
    saveMapping(newMapping);

    // 输出统计
    log(colors.magenta, '=' .repeat(40));
    log(colors.green, `✅ 成功上传: ${successCount} 张`);
    if (failCount > 0) {
      log(colors.red, `❌ 上传失败: ${failCount} 张`);
    }
    log(colors.cyan, `📊 总计: ${Object.keys(newMapping).length} 张图片已映射`);

  } catch (error) {
    log(colors.red, `💥 程序执行出错: ${error.message}`);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { uploadToImgBB, CONFIG };
