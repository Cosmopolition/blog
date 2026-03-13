// 导航和交互功能
(function() {
  'use strict';

  // ============ 滚动进度条 ============
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    scrollProgress.style.transform = `scaleX(${progress})`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ============ 导航点交互 ============
  const navDots = document.querySelectorAll('.nav-dot');
  const sections = ['hero', 'products', 'skills', 'journey', 'cta'];

  // 点击导航
  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const sectionId = dot.dataset.section;
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 滚动更新导航点
  function updateNavDots() {
    const scrollTop = window.scrollY + window.innerHeight / 2;

    sections.forEach((id, index) => {
      const section = document.getElementById(id);
      if (section) {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (scrollTop >= top && scrollTop < bottom) {
          navDots.forEach(d => d.classList.remove('active'));
          navDots[index].classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateNavDots, { passive: true });

  // ============ 键盘导航 ============
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault();
      const currentIndex = sections.findIndex(id =>
        document.getElementById(id).classList.contains('active') ||
        navDots[sections.indexOf(id)].classList.contains('active')
      );
      const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
      document.getElementById(sections[nextIndex])?.scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      const currentIndex = sections.findIndex(id =>
        navDots[sections.indexOf(id)].classList.contains('active')
      );
      const prevIndex = Math.max(currentIndex - 1, 0);
      document.getElementById(sections[prevIndex])?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // ============ 滚动视差效果 ============
  const parallaxElements = document.querySelectorAll('.section-header, .product-item, .journey-stop');
  const isTouchDevice = 'ontouchstart' in window;

  function handleParallax() {
    // 触摸设备禁用视差，避免卡顿
    if (isTouchDevice) return;

    parallaxElements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;

      if (visible) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const yOffset = (progress - 0.5) * 30;
        el.style.transform = `translateY(${yOffset}px)`;
        el.style.opacity = Math.min(1, progress * 2);
      }
    });
  }

  if (!isTouchDevice) {
    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax();
  }

  // ============ 流畅的入场动画 ============
  function animateOnScroll() {
    const elements = document.querySelectorAll('.product-item, .journey-stop');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(60px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', animateOnScroll);

  // 添加 visible 样式
  const style = document.createElement('style');
  style.textContent = `
    .product-item.visible, .journey-stop.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
})();
