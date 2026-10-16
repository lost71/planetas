/**
 * Sistema Solar 3D com Three.js
 * Inclui geração procedural de texturas de alta definição, anéis 3D, órbitas iluminadas,
 * câmera interativa com interpolação suave (lerp) e modo de velocidade da luz / dobra espacial.
 */

class SolarSystem3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.planets = {};
    this.orbitLines = [];
    this.starField = null;
    this.warpParticles = null;
    this.asteroidBelt = null;
    this.kuiperBelt = null;
    this.isWarpSpeed = false;
    this.showOrbits = true;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredObject = null;
    
    // Câmera e animações
    this.targetCameraPos = new THREE.Vector3(0, 80, 160);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);
    this.currentLookAt = new THREE.Vector3(0, 0, 0);
    this.focusedPlanet = null;
    this.orbitSpeedMultiplier = 1;

    this.init();
  }

  init() {
    // 1. Cena
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x040510, 0.0007);

    // 2. Câmera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 3000);
    this.camera.position.set(0, 85, 175);

    // 3. Renderizador WebGL
    // 3. Renderizador WebGL otimizado
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.planetMeshes = [];
    this.lastRaycastTime = 0;

    // 4. OrbitControls
    if (window.THREE && THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 600;
      this.controls.minDistance = 8;
      this.controls.enablePan = true;
    }

    // 5. Iluminação
    this.setupLighting();

    // 6. Céu Estrelado Cósmico, Cinturões e Partículas
    this.createStarfield();
    this.createWarpParticles();
    this.createAsteroidBelt();
    this.createKuiperBelt();

    // 7. Construir o Sol e a Grande Família de Planetas
    this.buildSolarSystem();

    // 8. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.onClick(e));

    // Loop de Animação
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Luz ambiente suave para planetas distantes não ficarem 100% pretos
    const ambientLight = new THREE.AmbientLight(0x223355, 0.7);
    this.scene.add(ambientLight);

    // Luz pontual central emitida pelo Sol
    this.sunLight = new THREE.PointLight(0xfff7e6, 2.8, 1200, 0.6);
    this.sunLight.position.set(0, 0, 0);
    this.scene.add(this.sunLight);

    // Luz secundária sutil para visual estético
    const hemiLight = new THREE.HemisphereLight(0x4466aa, 0x111122, 0.3);
    this.scene.add(hemiLight);
  }

  // Gera texturas ricas proceduralmente em Canvas HTML5
  generateTexture(type, colorHex1, colorHex2) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, colorHex1);
    grad.addColorStop(1, colorHex2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Detalhes procedurais específicos por tipo de planeta
    if (type === 'sun') {
      // Chamas e turbulência solar
      for (let i = 0; i < 400; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 230, 100, 0.35)' : 'rgba(255, 80, 0, 0.25)';
        ctx.beginPath();
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const r = Math.random() * 28 + 4;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'earth') {
      // Oceanos e Continentes Verdes/Azuis
      ctx.fillStyle = '#1e5ca8';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#348f50';
      // Desenha formas continentais
      for (let i = 0; i < 45; i++) {
        ctx.beginPath();
        const cx = Math.random() * 512;
        const cy = Math.random() * 200 + 28;
        ctx.arc(cx, cy, Math.random() * 45 + 15, 0, Math.PI * 2);
        ctx.fill();
      }
      // Nuvens esbranquiçadas transparentes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 35; i++) {
        ctx.fillRect(Math.random() * 512, Math.random() * 256, Math.random() * 90 + 20, Math.random() * 12 + 4);
      }
    } else if (type === 'jupiter' || type === 'saturn') {
      // Faixas gasosas de tempestade
      for (let y = 0; y < 256; y += 6) {
        const opacity = Math.random() * 0.4 + 0.1;
        ctx.fillStyle = Math.random() > 0.5 ? `rgba(240, 200, 150, ${opacity})` : `rgba(160, 80, 30, ${opacity})`;
        ctx.fillRect(0, y, 512, Math.random() * 8 + 3);
      }
      // Grande Mancha Vermelha de Júpiter
      if (type === 'jupiter') {
        ctx.fillStyle = '#b33927';
        ctx.beginPath();
        ctx.ellipse(320, 160, 42, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ef6a45';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    } else if (type === 'mars') {
      // Crateras e calotas polares
      ctx.fillStyle = 'rgba(100, 30, 10, 0.3)';
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 15 + 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Calotas polares brancas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 18);
      ctx.fillRect(0, 238, 512, 18);
    } else if (type === 'pluto') {
      // Coração branco de gelo Tombaugh Regio
      ctx.fillStyle = 'rgba(250, 240, 230, 0.85)';
      ctx.beginPath();
      ctx.arc(260, 130, 35, 0, Math.PI * 2);
      ctx.arc(295, 130, 35, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'magma') {
      // Rios de lava incandescente e fendas incandescentes (WASP-76b)
      ctx.fillStyle = 'rgba(255, 60, 0, 0.45)';
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 22 + 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        let lx = Math.random() * 512;
        let ly = Math.random() * 256;
        ctx.moveTo(lx, ly);
        for (let j = 0; j < 4; j++) {
          lx += (Math.random() - 0.5) * 50;
          ly += (Math.random() - 0.5) * 35;
          ctx.lineTo(lx, ly);
        }
        ctx.stroke();
      }
    } else if (type === 'ice') {
      // Cristais de gelo e fissuras gélidas (Éris, Haumea)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 24; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 256);
        ctx.lineTo(Math.random() * 512, Math.random() * 256);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 35; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 12 + 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Ruído de crateras rochosas padrão
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let i = 0; i < 70; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 10 + 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  // Gera textura para os anéis de Saturno com canais de opacidade concêntricos
  generateRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.15, 'rgba(215, 185, 140, 0.8)');
    grad.addColorStop(0.4, 'rgba(180, 145, 100, 0.4)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.1)'); // Divisão de Cassini
    grad.addColorStop(0.7, 'rgba(225, 195, 150, 0.85)');
    grad.addColorStop(0.95, 'rgba(160, 130, 90, 0.5)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  createStarfield() {
    const starCount = 3200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colors = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xaed8f2),
      new THREE.Color(0xfff0aa),
      new THREE.Color(0xff99bb),
      new THREE.Color(0x99e6ff)
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 600 + Math.random() * 1200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = colors[Math.floor(Math.random() * colors.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    this.starField = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.starField);
  }

  createWarpParticles() {
    const count = 400;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
      speeds[i] = 4 + Math.random() * 8;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.warpSpeeds = speeds;

    const mat = new THREE.PointsMaterial({
      color: 0x66ccff,
      size: 2.5,
      transparent: true,
      opacity: 0
    });

  createAsteroidBelt() {
    const count = 1200;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 72 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3.8;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const shade = 0.45 + Math.random() * 0.35;
      colors[i * 3] = shade;
      colors[i * 3 + 1] = shade * 0.92;
      colors[i * 3 + 2] = shade * 0.85;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.asteroidBelt = new THREE.Points(geom, mat);
    this.scene.add(this.asteroidBelt);
  }

  createKuiperBelt() {
    const count = 900;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 205 + Math.random() * 95;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 7.5;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Cristais de gelo de metano e água
      colors[i * 3] = 0.55 + Math.random() * 0.35;
      colors[i * 3 + 1] = 0.75 + Math.random() * 0.25;
      colors[i * 3 + 2] = 0.95;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    this.kuiperBelt = new THREE.Points(geom, mat);
    this.scene.add(this.kuiperBelt);
  }

  buildSolarSystem() {
    // Configurações dimensionais do Sistema Solar e Mundos Exóticos
    const planetConfigs = [
      { id: 'sun', name: 'Sol', size: 14, dist: 0, speed: 0, rotSpeed: 0.003, textureType: 'sun', col1: '#ff9900', col2: '#ff3300' },
      { id: 'mercury', name: 'Mercúrio', size: 1.2, dist: 24, speed: 0.035, rotSpeed: 0.01, textureType: 'mercury', col1: '#999999', col2: '#555555' },
      { id: 'venus', name: 'Vênus', size: 2.1, dist: 35, speed: 0.024, rotSpeed: 0.006, textureType: 'venus', col1: '#e8c07d', col2: '#a86520' },
      { id: 'earth', name: 'Terra', size: 2.4, dist: 49, speed: 0.018, rotSpeed: 0.02, textureType: 'earth', col1: '#2670e8', col2: '#1b8a43', hasMoon: true },
      { id: 'mars', name: 'Marte', size: 1.6, dist: 64, speed: 0.014, rotSpeed: 0.018, textureType: 'mars', col1: '#d64527', col2: '#731e0c' },
      { id: 'ceres', name: 'Ceres', size: 0.85, dist: 78, speed: 0.011, rotSpeed: 0.015, textureType: 'rocky', col1: '#b0aba0', col2: '#5c5850' },
      { id: 'jupiter', name: 'Júpiter', size: 6.8, dist: 98, speed: 0.008, rotSpeed: 0.035, textureType: 'jupiter', col1: '#df9c5c', col2: '#965020', hasJupiterMoons: true },
      { id: 'saturn', name: 'Saturno', size: 5.6, dist: 132, speed: 0.006, rotSpeed: 0.03, textureType: 'saturn', col1: '#ebd399', col2: '#b89647', hasRings: true, hasTitan: true },
      { id: 'uranus', name: 'Urano', size: 3.6, dist: 164, speed: 0.004, rotSpeed: 0.022, textureType: 'uranus', col1: '#85e5e8', col2: '#3d9499', tilt: 1.7, hasRings: true, ringColor: 0x66ccdd },
      { id: 'neptune', name: 'Netuno', size: 3.4, dist: 194, speed: 0.003, rotSpeed: 0.024, textureType: 'neptune', col1: '#3d5afe', col2: '#1a237e' },
      { id: 'pluto', name: 'Plutão', size: 0.9, dist: 220, speed: 0.002, rotSpeed: 0.008, textureType: 'pluto', col1: '#d7b89c', col2: '#8b694b' },
      { id: 'haumea', name: 'Haumea', size: 0.85, dist: 242, speed: 0.0019, rotSpeed: 0.04, textureType: 'ice', col1: '#cbd5e1', col2: '#64748b', hasRings: true, ringColor: 0x99bbdd },
      { id: 'makemake', name: 'Makemake', size: 0.85, dist: 262, speed: 0.0016, rotSpeed: 0.01, textureType: 'rocky', col1: '#ea580c', col2: '#7c2d12' },
      { id: 'eris', name: 'Éris', size: 0.95, dist: 285, speed: 0.0013, rotSpeed: 0.009, textureType: 'ice', col1: '#bae6fd', col2: '#0284c7' },
      { id: 'kepler-452b', name: 'Kepler-452b', size: 2.8, dist: 318, speed: 0.0011, rotSpeed: 0.016, textureType: 'earth', col1: '#059669', col2: '#10b981' },
      { id: 'wasp-76b', name: 'WASP-76b', size: 5.2, dist: 355, speed: 0.0009, rotSpeed: 0.028, textureType: 'magma', col1: '#7e22ce', col2: '#ef4444' }
    ];

    planetConfigs.forEach(cfg => {
      // 1. Textura
      const texture = this.generateTexture(cfg.textureType, cfg.col1, cfg.col2);

      // 2. Material
      let material;
      if (cfg.id === 'sun') {
        material = new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff
        });
      } else {
        material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1
        });
      }

      // 3. Geometria da Esfera Planetária otimizada
      const geometry = new THREE.SphereGeometry(cfg.size, 32, 28);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { id: cfg.id, name: cfg.name, config: cfg };

      // Se for o Sol, cria um brilho corona pulsante ao redor
      if (cfg.id === 'sun') {
        const glowGeom = new THREE.SphereGeometry(cfg.size * 1.25, 24, 20);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0xffaa00,
          transparent: true,
          opacity: 0.35,
          side: THREE.BackSide
        });
        const glowMesh = new THREE.Mesh(glowGeom, glowMat);
        mesh.add(glowMesh);
        mesh.userData.glow = glowMesh;
      }

      // Se for a Terra, adiciona a Lua em órbita
      if (cfg.hasMoon) {
        const moonGeom = new THREE.SphereGeometry(0.5, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 });
        const moon = new THREE.Mesh(moonGeom, moonMat);
        moon.position.set(4.5, 0, 0);
        mesh.add(moon);
        mesh.userData.moon = moon;
      }

      // Luas de Júpiter (Europa e Ganimedes)
      if (cfg.hasJupiterMoons) {
        mesh.userData.moons = [];
        const europaGeom = new THREE.SphereGeometry(0.38, 14, 14);
        const europaMat = new THREE.MeshStandardMaterial({ color: 0xddeeff, roughness: 0.5 });
        const europa = new THREE.Mesh(europaGeom, europaMat);
        mesh.add(europa);
        mesh.userData.moons.push({ mesh: europa, dist: 9.5, speed: 0.025, angle: 1.2 });

        const ganymedeGeom = new THREE.SphereGeometry(0.55, 14, 14);
        const ganymedeMat = new THREE.MeshStandardMaterial({ color: 0x998877, roughness: 0.8 });
        const ganymede = new THREE.Mesh(ganymedeGeom, ganymedeMat);
        mesh.add(ganymede);
        mesh.userData.moons.push({ mesh: ganymede, dist: 13.5, speed: 0.015, angle: 3.4 });
      }

      // Lua de Saturno (Titã)
      if (cfg.hasTitan) {
        if (!mesh.userData.moons) mesh.userData.moons = [];
        const titanGeom = new THREE.SphereGeometry(0.6, 14, 14);
        const titanMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
        const titan = new THREE.Mesh(titanGeom, titanMat);
        mesh.add(titan);
        mesh.userData.moons.push({ mesh: titan, dist: 13.5, speed: 0.02, angle: 2.1 });
      }

      // Anéis Majestosos (Saturno, Urano, Haumea)
      if (cfg.hasRings) {
        const ringGeom = new THREE.RingGeometry(cfg.size * 1.35, cfg.size * (cfg.id === 'saturn' ? 2.5 : 1.7), 42);
        ringGeom.rotateX(cfg.tilt ? Math.PI / 2 : Math.PI / 2.3);
        const ringTex = cfg.id === 'saturn' ? this.generateRingTexture() : null;
        const ringMat = new THREE.MeshBasicMaterial({
          map: ringTex,
          color: cfg.ringColor || 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: cfg.id === 'saturn' ? 0.88 : 0.55
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        mesh.add(ringMesh);
      }

      if (cfg.tilt) {
        mesh.rotation.z = cfg.tilt;
      }

      // 4. Criação da Órbita Iluminada (Traçado leve)
      if (cfg.dist > 0) {
        const orbitCurve = new THREE.EllipseCurve(
          0, 0,
          cfg.dist, cfg.dist,
          0, 2 * Math.PI,
          false,
          0
        );
        const points = orbitCurve.getPoints(64);
        const orbitGeom = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
        const orbitMat = new THREE.LineBasicMaterial({
          color: 0x336699,
          transparent: true,
          opacity: 0.38
        });
        const orbitLine = new THREE.Line(orbitGeom, orbitMat);
        this.scene.add(orbitLine);
        this.orbitLines.push(orbitLine);
      }

      // Posição angular inicial aleatória para os planetas não começarem enfileirados
      const startAngle = Math.random() * Math.PI * 2;
      mesh.position.x = Math.cos(startAngle) * cfg.dist;
      mesh.position.z = Math.sin(startAngle) * cfg.dist;

      this.scene.add(mesh);
      this.planets[cfg.id] = {
        mesh,
        config: cfg,
        angle: startAngle
      };
      this.planetMeshes.push(mesh);
    });
  }

  // Foco Suave da Câmera no Planeta Selecionado
  focusOnPlanet(planetId) {
    if (planetId === 'all') {
      this.focusedPlanet = null;
      this.targetLookAt.set(0, 0, 0);
      this.targetCameraPos.set(0, 85, 175);
      if (this.controls) this.controls.target.set(0, 0, 0);
      return;
    }

    const p = this.planets[planetId];
    if (!p) return;

    this.focusedPlanet = p;
    const mesh = p.mesh;
    const cfg = p.config;

    // Calcula distância confortável dependendo do tamanho do astro
    const zoomDist = cfg.id === 'sun' ? 42 : Math.max(cfg.size * 5, 12);
    
    // Atualiza destino de olhar e câmera
    this.targetLookAt.copy(mesh.position);
    this.targetCameraPos.set(
      mesh.position.x + zoomDist * 0.7,
      mesh.position.y + zoomDist * 0.45,
      mesh.position.z + zoomDist * 0.7
    );
  }

  toggleOrbits() {
    this.showOrbits = !this.showOrbits;
    this.orbitLines.forEach(line => {
      line.visible = this.showOrbits;
    });
    return this.showOrbits;
  }

  toggleWarpSpeed() {
    this.isWarpSpeed = !this.isWarpSpeed;
    if (this.isWarpSpeed) {
      this.orbitSpeedMultiplier = 6;
      this.warpParticles.material.opacity = 0.9;
    } else {
      this.orbitSpeedMultiplier = 1;
      this.warpParticles.material.opacity = 0;
    }
    return this.isWarpSpeed;
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event) {
    // Coordenadas normalizadas do mouse (-1 até 1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycasting com throttle de ~40ms para máxima suavidade sem travar a CPU
    const now = performance.now();
    if (now - this.lastRaycastTime < 40) return;
    this.lastRaycastTime = now;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = this.planetMeshes.length > 0 ? this.planetMeshes : Object.values(this.planets).map(p => p.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      document.body.style.cursor = 'pointer';
      this.hoveredObject = intersects[0].object;
    } else {
      document.body.style.cursor = 'default';
      this.hoveredObject = null;
    }
  }

  onClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = this.planetMeshes.length > 0 ? this.planetMeshes : Object.values(this.planets).map(p => p.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const planetId = clickedMesh.userData.id;
      if (planetId && window.cosmoApp) {
        window.cosmoApp.selectPlanet(planetId, true);
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = 0.016;

    // 1. Rotação do campo estelar de fundo
    if (this.starField) {
      this.starField.rotation.y += 0.0001;
    }

    // 2. Animação de Efeito de Dobra / Warp Speed
    if (this.isWarpSpeed && this.warpParticles) {
      const positions = this.warpParticles.geometry.attributes.position.array;
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 2] += this.warpSpeeds[i] * 3;
        if (positions[i * 3 + 2] > 400) {
          positions[i * 3 + 2] = -400;
        }
      }
      this.warpParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Atualizar órbitas e rotação dos planetas
    Object.values(this.planets).forEach(p => {
      const { mesh, config } = p;

      // Rotação axial do planeta
      mesh.rotation.y += config.rotSpeed;

      // Rotação orbital em torno do Sol
      if (config.dist > 0) {
        p.angle += config.speed * 0.3 * this.orbitSpeedMultiplier * delta;
        mesh.position.x = Math.cos(p.angle) * config.dist;
        mesh.position.z = Math.sin(p.angle) * config.dist;
      }

      // Rotação da Lua da Terra
      if (mesh.userData.moon) {
        mesh.userData.moon.rotation.y += 0.05;
      }

      // Rotação de múltiplas Luas (Júpiter e Saturno)
      if (mesh.userData.moons) {
        mesh.userData.moons.forEach(m => {
          m.angle += m.speed * this.orbitSpeedMultiplier * delta * 12;
          m.mesh.position.x = Math.cos(m.angle) * m.dist;
          m.mesh.position.z = Math.sin(m.angle) * m.dist;
          m.mesh.rotation.y += 0.03;
        });
      }

      // Pulsação sutil da corona solar
      if (config.id === 'sun' && mesh.userData.glow) {
        const scale = 1.25 + Math.sin(Date.now() * 0.003) * 0.04;
        mesh.userData.glow.scale.set(scale, scale, scale);
      }
    });

    // Rotação dos Cinturões de Asteroides e Kuiper
    if (this.asteroidBelt) {
      this.asteroidBelt.rotation.y += 0.0004 * this.orbitSpeedMultiplier;
    }
    if (this.kuiperBelt) {
      this.kuiperBelt.rotation.y += 0.00015 * this.orbitSpeedMultiplier;
    }

    // 4. Interpolação de Câmera suave até o planeta focado
    if (this.focusedPlanet) {
      const targetPos = this.focusedPlanet.mesh.position;
      const cfg = this.focusedPlanet.config;
      const zoomDist = cfg.id === 'sun' ? 42 : Math.max(cfg.size * 5, 12);

      this.targetLookAt.copy(targetPos);
      this.targetCameraPos.set(
        targetPos.x + zoomDist * 0.7,
        targetPos.y + zoomDist * 0.45,
        targetPos.z + zoomDist * 0.7
      );
    }

    // Suaviza a transição da câmera (Lerp)
    this.currentLookAt.lerp(this.targetLookAt, 0.05);
    this.camera.position.lerp(this.targetCameraPos, 0.04);
    
    if (this.controls) {
      this.controls.target.lerp(this.targetLookAt, 0.05);
      this.controls.update();
    } else {
      this.camera.lookAt(this.currentLookAt);
    }

    // 5. Renderização final do frame
    this.renderer.render(this.scene, this.camera);
  }
}

window.SolarSystem3D = SolarSystem3D;
