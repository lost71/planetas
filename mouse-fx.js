/**
 * Efeitos Cósmicos Interativos do Mouse
 * Inclui: Trilha de poeira estelar (Stardust Particles), onda gravitacional ao clicar,
 * cursor com anel inercial e reatividade física com o espaço.
 */

class CosmicMouseFX {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.shockwaves = [];
    this.cursorEl = document.getElementById('cosmicCursor');
    
    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      isDown: false
    };

    this.colors = [
      '#00ffff', // Ciano neon
      '#bd00ff', // Roxo cósmico
      '#ff007f', // Rosa nebulosa
      '#ffe600', // Dourado solar
      '#ffffff'  // Branco estelar
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Rastreamento do mouse com inércia
    window.addEventListener('mousemove', (e) => {
      this.mouse.vx = e.clientX - this.mouse.targetX;
      this.mouse.vy = e.clientY - this.mouse.targetY;
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;

      // Gera partículas de rastro estelar proporcionais à velocidade do mouse
      const speed = Math.hypot(this.mouse.vx, this.mouse.vy);
      const spawnCount = Math.min(Math.floor(speed * 0.4) + 1, 6);
      
      for (let i = 0; i < spawnCount; i++) {
        this.addParticle(e.clientX, e.clientY, this.mouse.vx, this.mouse.vy);
      }
    });

    window.addEventListener('mousedown', (e) => {
      this.mouse.isDown = true;
      if (this.cursorEl) this.cursorEl.classList.add('cursor-active');
      this.addShockwave(e.clientX, e.clientY);
      // Explosão de poeira cósmica ao clicar
      for (let i = 0; i < 20; i++) {
        this.addExplosionParticle(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
      if (this.cursorEl) this.cursorEl.classList.remove('cursor-active');
    });

    // Animação contínua de partículas
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addParticle(x, y, vx, vy) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.5;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];

    this.particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: -vx * 0.15 + Math.cos(angle) * speed,
      vy: -vy * 0.15 + Math.sin(angle) * speed,
      size: Math.random() * 3.5 + 1.2,
      alpha: 1,
      decay: Math.random() * 0.025 + 0.015,
      color: color,
      spin: Math.random() * 0.2 - 0.1,
      angle: 0
    });

    if (this.particles.length > 250) {
      this.particles.shift();
    }
  }

  addExplosionParticle(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];

    this.particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 4 + 2,
      alpha: 1,
      decay: Math.random() * 0.04 + 0.02,
      color: color,
      spin: 0,
      angle: 0
    });
  }

  addShockwave(x, y) {
    this.shockwaves.push({
      x: x,
      y: y,
      radius: 4,
      maxRadius: 75,
      alpha: 0.9,
      decay: 0.035,
      color: '#00ffff'
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Suaviza a posição do cursor estelar
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.25;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.25;

    if (this.cursorEl) {
      this.cursorEl.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
    }

    // Limpa o canvas com rastro sutil
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Renderiza e atualiza as Ondas Gravitacionais (Shockwaves)
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 0.12 + 1;
      sw.alpha -= sw.decay;

      if (sw.alpha <= 0) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(0, 240, 255, ${sw.alpha})`;
      this.ctx.lineWidth = 2.5;
      this.ctx.shadowColor = '#00ffff';
      this.ctx.shadowBlur = 12;
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Renderiza e atualiza as Partículas de Poeira Estelar
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.alpha -= p.decay;
      p.size = Math.max(0.2, p.size * 0.98);
      p.angle += p.spin;

      if (p.alpha <= 0 || p.size <= 0.2) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;

      // Desenha forma de estrela/círculo cintilante
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}

window.CosmicMouseFX = CosmicMouseFX;
