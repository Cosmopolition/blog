// CDN图片加载失败时的降级处理
document.addEventListener('DOMContentLoaded', function() {
    const cdnImages = document.querySelectorAll('.cdn-image');

    cdnImages.forEach(img => {
        img.addEventListener('error', function() {
            // 如果CDN图片加载失败，尝试使用本地图片
            const currentSrc = this.src;
            if (currentSrc.includes('cdn.nlark.com')) {
                // 替换为本地图片路径
                const localSrc = currentSrc.replace('https://cdn.nlark.com/yuque/0/2026/jpeg/23024237/', '/images/posts/');
                this.src = localSrc.replace('.jpeg', '.jpg');
                console.log('CDN图片加载失败，降级到本地图片:', localSrc);
            }
        });

        img.addEventListener('load', function() {
            console.log('CDN图片加载成功:', this.src);
        });
    });
});
