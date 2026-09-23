// Qurious 周刊 · 思考展开/收起
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-toggle]');
    if (!btn) return;
    var card = btn.closest('.qr-question');
    if (!card) return;
    var open = card.classList.toggle('is-open');
    btn.classList.toggle('is-open', open);
    btn.textContent = open ? '收起思考' : '展开思考';
  });

  // 键盘可访问性:Cmd/Ctrl + Enter 展开/收起所有
  document.addEventListener('keydown', function (e) {
    if (!(e.metaKey || e.ctrlKey) || e.key !== 'Enter') return;
    var scope = document.querySelector('.qurious-scope');
    if (!scope) return;
    var questions = scope.querySelectorAll('.qr-question');
    if (!questions.length) return;
    var anyOpen = Array.from(questions).some(function (q) { return q.classList.contains('is-open'); });
    questions.forEach(function (q) {
      var btn = q.querySelector('[data-toggle]');
      if (anyOpen) {
        q.classList.remove('is-open');
        if (btn) { btn.classList.remove('is-open'); btn.textContent = '展开思考'; }
      } else {
        q.classList.add('is-open');
        if (btn) { btn.classList.add('is-open'); btn.textContent = '收起思考'; }
      }
    });
  });
})();
