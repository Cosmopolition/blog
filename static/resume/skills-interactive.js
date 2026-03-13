// 技能和产品交互
(function() {
  'use strict';

  // ============ 3D 产品球体交互 ============
  const orbs = document.querySelectorAll('.product-orb');
  orbs.forEach(orb => {
    orb.addEventListener('mousemove', (e) => {
      const rect = orb.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      orb.style.transform = `scale(1.1) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    });
    orb.addEventListener('mouseleave', () => {
      orb.style.transform = '';
    });
  });

  // ============ 技能星空 - 漂浮节点 ============
  const skills = [
    { name: 'iOS / Swift', type: 'tech' },
    { name: 'React', type: 'tech' },
    { name: 'Vue', type: 'tech' },
    { name: 'TypeScript', type: 'tech' },
    { name: 'Python', type: 'tech' },
    { name: 'AI / ML', type: 'ai' },
    { name: '用户研究', type: 'product' },
    { name: '体验设计', type: 'product' },
    { name: '数据分析', type: 'product' },
    { name: '项目管理', type: 'product' },
    { name: 'AI 产品', type: 'ai' },
    { name: 'Node.js', type: 'tech' },
  ];

  const skillsUniverse = document.getElementById('skillsUniverse');
  const skillsCanvas = document.getElementById('skillsCanvas');
  const skillCtx = skillsCanvas.getContext('2d');
  const skillNodes = [];

  function initSkillsUniverse() {
    const rect = skillsUniverse.getBoundingClientRect();
    skillsCanvas.width = rect.width;
    skillsCanvas.height = rect.height;

    // 清除旧节点
    document.querySelectorAll('.skill-float').forEach(el => el.remove());
    skillNodes.length = 0;

    const isMobile = window.innerWidth < 768;
    const padding = isMobile ? 60 : 100;

    // 移动端用网格布局，避免重叠
    const cols = isMobile ? 3 : 4;
    const rows = Math.ceil(skills.length / cols);
    const cellW = (rect.width - padding * 2) / cols;
    const cellH = (rect.height - padding * 2) / rows;

    skills.forEach((skill, i) => {
      const node = document.createElement('span');
      node.className = `skill-float ${skill.type}`;
      node.textContent = skill.name;

      let x, y;
      if (isMobile) {
        // 网格布局 + 随机偏移
        const col = i % cols;
        const row = Math.floor(i / cols);
        x = padding + col * cellW + cellW / 2 + (Math.random() - 0.5) * 30;
        y = padding + row * cellH + cellH / 2 + (Math.random() - 0.5) * 20;
      } else {
        // 桌面端完全随机
        x = padding + Math.random() * (rect.width - padding * 2);
        y = padding + Math.random() * (rect.height - padding * 2);
      }

      node.style.left = x + 'px';
      node.style.top = y + 'px';
      node.style.animationDelay = `${-Math.random() * 6}s`;

      // 移动端减少动画幅度
      if (isMobile) {
        node.style.animationDuration = '10s';
      }

      skillsUniverse.appendChild(node);
      skillNodes.push({ el: node, x, y, baseX: x, baseY: y });
    });
  }

  // 绘制连接线
  function drawSkillConnections() {
    skillCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);

    const isMobile = window.innerWidth < 768;
    const maxDist = isMobile ? 150 : 200;

    for (let i = 0; i < skillNodes.length; i++) {
      const nodeA = skillNodes[i];
      const rectA = nodeA.el.getBoundingClientRect();
      const parentRect = skillsUniverse.getBoundingClientRect();
      const ax = rectA.left - parentRect.left + rectA.width / 2;
      const ay = rectA.top - parentRect.top + rectA.height / 2;

      for (let j = i + 1; j < skillNodes.length; j++) {
        const nodeB = skillNodes[j];
        const rectB = nodeB.el.getBoundingClientRect();
        const bx = rectB.left - parentRect.left + rectB.width / 2;
        const by = rectB.top - parentRect.top + rectB.height / 2;

        const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * (isMobile ? 0.1 : 0.15);
          skillCtx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
          skillCtx.lineWidth = 1;
          skillCtx.beginPath();
          skillCtx.moveTo(ax, ay);
          skillCtx.lineTo(bx, by);
          skillCtx.stroke();
        }
      }
    }

    requestAnimationFrame(drawSkillConnections);
  }

  // 初始化技能星空
  setTimeout(() => {
    initSkillsUniverse();
    drawSkillConnections();
  }, 100);

  window.addEventListener('resize', initSkillsUniverse);
})();
