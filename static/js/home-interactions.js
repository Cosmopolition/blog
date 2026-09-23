/* ==========================================================
   主页交互 · Renaissance × Rococo
   - Candle light 鼠标跟随
   - Manuscript 3D tilt
   - Note scroll reveal + hover tilt
   - Scroll progress bar
   - Bookshelf subtle float on scroll
   ========================================================== */

(function () {
  'use strict';

  // 守卫:不在主页时不执行
  var scope = document.querySelector('.home-scope');
  if (!scope) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------
     1. Candle light —— 鼠标位置径向渐变 + requestAnimationFrame lerp
     ---------------------------------------------------- */
  var candleLight = document.getElementById('candleLight');
  if (candleLight && !reducedMotion) {
    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var currentX = mouseX;
    var currentY = mouseY;
    var candleRunning = true;
    var lastMoveTime = 0;
    var idleTimeout = null;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTime = Date.now();
      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = setTimeout(function () {
        candleRunning = true; // 保持 lerp,只在浏览器标签失焦时停止
      }, 200);
    });

    function animateCandle() {
      // lerp 8% 平滑
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      candleLight.style.setProperty('--mx', currentX + 'px');
      candleLight.style.setProperty('--my', currentY + 'px');
      requestAnimationFrame(animateCandle);
    }
    animateCandle();

    // 标记 ready,启用 candle light opacity 过渡
    window.addEventListener('load', function () {
      scope.classList.add('is-ready');
    });
    // load 事件已触发的情况(JS defer)
    if (document.readyState === 'complete') {
      scope.classList.add('is-ready');
    }
  }

  /* ----------------------------------------------------
     2. Manuscript 3D tilt —— mousemove 计算 ±4deg / ±3deg
     ---------------------------------------------------- */
  var msWrap = document.getElementById('manuscriptWrap');
  var ms = document.getElementById('manuscript');
  if (msWrap && ms && !reducedMotion) {
    msWrap.addEventListener('mousemove', function (e) {
      var rect = msWrap.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var rotateY = (x - 0.5) * 8;   // ±4deg
      var rotateX = (0.5 - y) * 6;   // ±3deg
      ms.style.transform = 'rotateY(' + rotateY + 'deg) rotateX(' + rotateX + 'deg) translateY(-4px)';
    });

    msWrap.addEventListener('mouseleave', function () {
      ms.style.transform = 'rotateY(0) rotateX(0) translateY(0)';
    });
  }

  /* ----------------------------------------------------
     3. Note scroll reveal + hover 3D tilt
     ---------------------------------------------------- */
  var notes = document.querySelectorAll('.recent-grid .note');

  if (notes.length && 'IntersectionObserver' in window && !reducedMotion) {
    var noteObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = Array.prototype.indexOf.call(notes, entry.target) * 0.1;
          entry.target.style.animationDelay = delay + 's';
          entry.target.classList.add('is-visible');
          noteObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    notes.forEach(function (note) { noteObserver.observe(note); });

    // Note hover tilt
    notes.forEach(function (note) {
      note.addEventListener('mousemove', function (e) {
        var rect = note.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var baseRot = note.classList.contains('n-1') ? -0.6 :
                      note.classList.contains('n-2') ? 0.8 :
                      note.classList.contains('n-3') ? -0.4 :
                      note.classList.contains('n-4') ? 0.3 : -0.7;
        var rotateY = (x - 0.5) * 6;
        var rotateX = (0.5 - y) * 4;
        note.style.transform = 'perspective(900px) rotateY(' + rotateY + 'deg) rotateX(' + rotateX + 'deg) translateY(-5px) rotate(' + baseRot + 'deg)';
      });
      note.addEventListener('mouseleave', function () {
        note.style.transform = '';
      });
    });
  } else {
    // 降级:直接可见
    notes.forEach(function (n) { n.classList.add('is-visible'); });
  }

  /* ----------------------------------------------------
     4. Scroll progress bar
     ---------------------------------------------------- */
  var scrollBar = document.getElementById('scrollBar');
  if (scrollBar) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollTop = window.scrollY;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          scrollBar.style.width = progress + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------
     5. Bookshelf subtle float on scroll
     ---------------------------------------------------- */
  var bookcase = document.querySelector('.bookcase');
  var bks = document.querySelectorAll('.bk');
  if (bookcase && bks.length && !reducedMotion) {
    window.addEventListener('scroll', function () {
      var rect = bookcase.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        var progress = 1 - Math.max(0, rect.top / window.innerHeight);
        bks.forEach(function (book, i) {
          var offset = (progress - 0.3) * (2 + (i % 3) * 0.8);
          book.style.marginTop = offset + 'px';
        });
      }
    }, { passive: true });
  }
})();
