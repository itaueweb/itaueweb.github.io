(function() {
  "use strict";
  function triggerGlitch() {
    const escena = document.querySelector('.escena');
    if (!escena) return;
    escena.classList.add('glitch-activo');
    setTimeout(() => escena.classList.remove('glitch-activo'), 300);
  }
  function initParticles() {
    const canvas = document.getElementById('particulas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 2 + 0.5, speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.5 + 0.2 });
    }
    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0; if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.fillStyle = `rgba(139, 0, 0, ${p.opacity})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; });
  }
  window.ITAUE_EFECTOS = { triggerGlitch, initParticles };
})();
