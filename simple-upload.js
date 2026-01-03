#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

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

// 配置
const envFromFile = loadEnvFile();
const CONFIG = {
  imgbbApiKey: process.env.IMGBB_API_KEY || envFromFile.IMGBB_API_KEY,
  imageDir: 'static/images/posts',
  mappingFile: 'image-mapping.json'
};

// 检查API Key
if (!CONFIG.imgbbApiKey) {
  console.error('❌ 请设置环境变量 IMGBB_API_KEY');
  console.error('   请先运行: npm run setup');
  process.exit(1);
}

// 读取现有映射
function loadMapping() {
  try {
    if (fs.existsSync(CONFIG.mappingFile)) {
      const data = fs.readFileSync(CONFIG.mappingFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('⚠️  读取映射文件失败:', error.message);
  }
  return {};
}

// 保存映射
function saveMapping(mapping) {
  try {
    fs.writeFileSync(CONFIG.mappingFile, JSON.stringify(mapping, null, 2));
    console.log('✅ 映射文件已保存');
  } catch (error) {
    console.error('❌ 保存映射文件失败:', error.message);
  }
}

// 上传到ImgBB
function uploadToImgBB(imagePath) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substring(2);
    const fileName = path.basename(imagePath);

    // 读取文件
    fs.readFile(imagePath, (err, fileData) => {
      if (err) {
        reject(err);
        return;
      }

      // 构建multipart/form-data
      const postData = [
        `--${boundary}\r\n`,
        `Content-Disposition: form-data; name="key"\r\n\r\n`,
        `${CONFIG.imgbbApiKey}\r\n`,
        `--${boundary}\r\n`,
        `Content-Disposition: form-data; name="image"; filename="${fileName}"\r\n`,
        `Content-Type: application/octet-stream\r\n\r\n`
      ].join('') + fileData.toString('binary') + `\r\n--${boundary}--\r\n`;

      const options = {
        hostname: 'api.imgbb.com',
        port: 443,
        path: '/1/upload',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': Buffer.byteLength(postData, 'binary')
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.success) {
              resolve({
                success: true,
                url: response.data.url,
                displayUrl: response.data.display_url,
                deleteUrl: response.data.delete_url,
                thumbUrl: response.data.thumb?.url
              });
            } else {
              reject(new Error(response.error?.message || 'Upload failed'));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData, 'binary');
      req.end();
    });
  });
}

// 扫描图片文件
function scanImages() {
  const images = [];
  const folders = ['hanggang-park', 'mengma-camp', 'jiaqiao-old-street'];

  folders.forEach(folder => {
    const folderPath = path.join(CONFIG.imageDir, folder);
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

// 主函数
async function main() {
  console.log('🎨 简单ImgBB上传工具 (无额外依赖)');
  console.log('=' .repeat(50));

  // 检查图片目录
  if (!fs.existsSync(CONFIG.imageDir)) {
    console.error(`❌ 图片目录不存在: ${CONFIG.imageDir}`);
    process.exit(1);
  }

  // 扫描图片
  console.log('🔍 扫描图片文件...');
  const imagePaths = scanImages();

  if (imagePaths.length === 0) {
    console.log('⚠️  未找到图片文件');
    return;
  }

  console.log(`📁 发现 ${imagePaths.length} 张图片`);

  // 读取现有映射
  const existingMapping = loadMapping();
  const existingCount = Object.keys(existingMapping).length;

  if (existingCount > 0) {
    console.log(`📋 现有映射: ${existingCount} 张图片`);
  }

  // 过滤待上传图片
  const toUpload = imagePaths.filter(imagePath => !existingMapping[imagePath]);

  if (toUpload.length === 0) {
    console.log('🎉 所有图片都已上传完毕！');
    return;
  }

  console.log(`📤 待上传: ${toUpload.length} 张图片`);

  // 上传图片
  const newMapping = { ...existingMapping };
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toUpload.length; i++) {
    const relativePath = toUpload[i];
    const fullPath = path.join(CONFIG.imageDir, relativePath);

    console.log(`⬆️  上传 ${i + 1}/${toUpload.length}: ${relativePath}`);

    try {
      const result = await uploadToImgBB(fullPath);

      if (result.success) {
        console.log(`✅ 成功: ${result.displayUrl}`);
        newMapping[relativePath] = {
          cdnUrl: result.url,
          displayUrl: result.displayUrl,
          deleteUrl: result.deleteUrl,
          thumbUrl: result.thumbUrl,
          uploadedAt: new Date().toISOString()
        };
        successCount++;
      }
    } catch (error) {
      console.error(`❌ 失败: ${error.message}`);
      failCount++;
    }

    // 避免API限制
    if (i < toUpload.length - 1) {
      console.log('⏳ 等待1秒...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // 保存映射
  saveMapping(newMapping);

  // 自动更新CDN shortcode
  if (successCount > 0) {
    await updateCDNShortcode(newMapping);
  }

  // 输出统计
  console.log('=' .repeat(50));
  console.log(`📊 上传完成`);
  console.log(`✅ 成功: ${successCount}`);
  if (failCount > 0) {
    console.log(`❌ 失败: ${failCount}`);
  }
  console.log(`📁 总计: ${Object.keys(newMapping).length} 张图片已映射`);

  if (successCount > 0) {
    console.log('\n💡 提示: CDN shortcode 已自动更新，图片将通过ImgBB CDN加载');
  }
}

// 重新生成CDN shortcode（用于已有映射的情况）
async function regenerateShortcode() {
  console.log('🔄 重新生成CDN shortcode...');
  const mapping = loadMapping();
  if (Object.keys(mapping).length === 0) {
    console.log('⚠️  没有找到映射文件');
    return;
  }
  await updateCDNShortcode(mapping);
  console.log('✅ CDN shortcode 已重新生成');
}

// 如果直接运行此脚本
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--regenerate')) {
    regenerateShortcode().catch(error => {
      console.error('💥 重新生成出错:', error.message);
      process.exit(1);
    });
  } else {
    main().catch(error => {
      console.error('💥 程序执行出错:', error.message);
      process.exit(1);
    });
  }
}

// 自动更新CDN shortcode
async function updateCDNShortcode(mapping) {
  const shortcodePath = 'layouts/shortcodes/cdnimage.html';

  // 生成映射条件
  const conditions = Object.entries(mapping)
    .map(([path, data], index) => {
      const prefix = index === 0 ? '{{- if' : '{{- else if';
      return `${prefix} eq $localPath "${path}" -}}\n  {{- $finalSrc = "${data.displayUrl}" -}}`;
    })
    .join('\n');

  const shortcodeContent = `{{- $src := .Get "src" -}}
{{- $alt := .Get "alt" | default "" -}}
{{- $class := .Get "class" | default "" -}}

{{- $finalSrc := $src -}}

{{- /* CDN URL映射 - 自动生成 */}}
{{- $localPath := strings.TrimPrefix "/images/posts/" $src -}}
${conditions}
{{- end -}}

{{- $imgClass := printf "cdn-image %s" $class | strings.TrimSpace -}}

<img src="{{ $finalSrc }}" alt="{{ $alt }}" class="{{ $imgClass }}" loading="lazy" />
`;

  try {
    await fs.promises.writeFile(shortcodePath, shortcodeContent, 'utf8');
    console.log('🔄 CDN shortcode 已自动更新');
  } catch (error) {
    console.warn('⚠️  更新CDN shortcode失败:', error.message);
  }
}

module.exports = { uploadToImgBB, CONFIG, updateCDNShortcode };
