/**
 * CosmoPedia 3D - Aplicação Principal
 * Orquestra a interface, dados espaciais, som sintetizado, busca, drawer, modais e quiz.
 */

class CosmoApp {
  constructor() {
    this.threeScene = null;
    this.mouseFx = null;
    this.bot = null;
    this.currentCategory = 'planets';
    this.searchQuery = '';
    this.audioEnabled = false;
    this.ambientSoundNode = null;
    this.audioCtx = null;
    
    // Live Ticker
    this.tickerIndex = 0;
    this.tickerInterval = null;

    // Quiz State
    this.currentQuizIndex = 0;
    this.quizScore = 0;
    this.quizAnswered = false;

    this.init();
  }

  init() {
    // 1. Inicializa o Three.js 3D Solar System
    try {
      this.threeScene = new SolarSystem3D('webglCanvas');
    } catch (e) {
      console.warn('Erro ao inicializar Three.js:', e);
    }

    // 2. Inicializa os Efeitos Cósmicos de Mouse
    try {
      this.mouseFx = new CosmicMouseFX('mouseFxCanvas');
    } catch (e) {
      console.warn('Erro ao inicializar Mouse FX:', e);
    }

    // 3. Inicializa o Robô AstroBot
    try {
      this.bot = new AstroBot();
    } catch (e) {
      console.warn('Erro ao inicializar AstroBot:', e);
    }

    // 4. Montar UI e Elementos Dinâmicos
    this.renderQuickPlanetSelector();
    this.renderCategoryCards();
    this.setupEventListeners();
    this.startLiveTicker();

    // Mensagem de boas-vindas do robô
    setTimeout(() => {
      if (this.bot) {
        this.bot.say("Bip bop! Seja bem-vindo à <strong>CosmoPedia</strong>! Explore o Sistema Solar em 3D, confira o radar de curiosidades ou passe o mouse pelos astros!");
        this.bot.playBotChirp([440, 554, 659, 880]);
      }
    }, 1200);
  }

  setupEventListeners() {
    // Navegação de Categorias
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.getAttribute('data-category');
        this.renderCategoryCards();
        this.playUiSound('click');
        
        // Abre o drawer se estiver fechado
        const drawer = document.getElementById('explorationDrawer');
        if (drawer.classList.contains('drawer-collapsed')) {
          drawer.classList.remove('drawer-collapsed');
        }
      });
    });

    // Busca com debounce
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('btnClearSearch');
    
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      clearBtn.style.display = this.searchQuery ? 'block' : 'none';
      this.renderCategoryCards();
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      this.searchQuery = '';
      clearBtn.style.display = 'none';
      this.renderCategoryCards();
      searchInput.focus();
    });

    // Toggle da Gaveta Lateral (Drawer)
    const btnToggleDrawer = document.getElementById('btnToggleDrawer');
    const drawer = document.getElementById('explorationDrawer');
    btnToggleDrawer.addEventListener('click', () => {
      drawer.classList.toggle('drawer-collapsed');
      const icon = btnToggleDrawer.querySelector('i');
      if (drawer.classList.contains('drawer-collapsed')) {
        icon.className = 'fa-solid fa-chevron-right';
      } else {
        icon.className = 'fa-solid fa-chevron-left';
      }
      this.playUiSound('toggle');
    });

    // Controles de Câmera 3D
    document.getElementById('btnResetCamera').addEventListener('click', () => {
      if (this.threeScene) this.threeScene.focusOnPlanet('all');
      this.playUiSound('camera');
      if (this.bot) this.bot.say("Câmera reposicionada para a vista panorâmica do Sistema Solar! 🌌");
    });

    document.getElementById('btnToggleOrbits').addEventListener('click', (e) => {
      if (this.threeScene) {
        const state = this.threeScene.toggleOrbits();
        e.currentTarget.querySelector('span').textContent = state ? 'Órbitas: ON' : 'Órbitas: OFF';
        this.playUiSound('toggle');
      }
    });

    document.getElementById('btnWarpSpeed').addEventListener('click', (e) => {
      if (this.threeScene) {
        const isWarp = this.threeScene.toggleWarpSpeed();
        if (isWarp) {
          e.currentTarget.classList.add('warp-active');
          e.currentTarget.querySelector('span').textContent = 'Saindo de Dobra';
          if (this.bot) this.bot.say("VELOCIDADE DA LUZ ATIVADA! Segure firme nas alças gravitacionais! ⚡⚡");
          this.playUiSound('warp');
        } else {
          e.currentTarget.classList.remove('warp-active');
          e.currentTarget.querySelector('span').textContent = 'Hiperespaço';
          if (this.bot) this.bot.say("Desacelerando de volta para órbita de cruzeiro cósmico! 🛸");
          this.playUiSound('click');
        }
      }
    });

    document.getElementById('btnAudioToggle').addEventListener('click', (e) => {
      this.toggleAudio(e.currentTarget);
    });

    // Próxima curiosidade do Ticker
    document.getElementById('btnNextFact').addEventListener('click', () => {
      this.nextLiveFact();
      this.playUiSound('radar');
    });

    // Modais
    document.getElementById('btnCloseModal').addEventListener('click', () => {
      document.getElementById('infoModal').classList.remove('modal-open');
    });

    document.getElementById('infoModal').addEventListener('click', (e) => {
      if (e.target.id === 'infoModal') {
        document.getElementById('infoModal').classList.remove('modal-open');
      }
    });

    document.getElementById('btnCloseQuiz').addEventListener('click', () => {
      document.getElementById('quizModal').classList.remove('modal-open');
    });

    document.getElementById('btnNextQuiz').addEventListener('click', () => {
      this.nextQuizQuestion();
    });
  }

  // Carrossel Rápido de Planetas na barra superior
  renderQuickPlanetSelector() {
    const container = document.getElementById('quickPlanetSelector');
    container.innerHTML = '';

    const planets = SPACE_DATA.planets;
    planets.forEach(p => {
      const chip = document.createElement('button');
      chip.className = 'planet-chip';
      chip.setAttribute('data-id', p.id);
      chip.innerHTML = `
        <span class="chip-color-dot" style="background: radial-gradient(circle, ${p.color}, ${p.secondaryColor})"></span>
        <span class="chip-label">${p.name}</span>
      `;
      chip.addEventListener('click', () => {
        this.selectPlanet(p.id, true);
        document.querySelectorAll('.planet-chip').forEach(c => c.classList.remove('chip-active'));
        chip.classList.add('chip-active');
      });
      container.appendChild(chip);
    });
  }

  // Renderiza cartões da categoria atual com filtro de busca
  renderCategoryCards() {
    const grid = document.getElementById('drawerCardsGrid');
    const badge = document.getElementById('itemsCountBadge');
    const title = document.getElementById('drawerTitle');
    grid.innerHTML = '';

    let items = SPACE_DATA[this.currentCategory] || [];

    // Título da Gaveta
    const categoryTitles = {
      planets: '<i class="fa-solid fa-globe"></i> Planetas do Sistema Solar',
      exoplanets: '<i class="fa-solid fa-ring"></i> Exoplanetas Fascinantes',
      astronautas: '<i class="fa-solid fa-user-astronaut"></i> Astronautas & Pioneiros',
      astronauts: '<i class="fa-solid fa-user-astronaut"></i> Astronautas & Pioneiros',
      deepspace: '<i class="fa-solid fa-atom"></i> Astros & Mistérios Cósmicos',
      missions: '<i class="fa-solid fa-satellite"></i> Missões & Telescópios'
    };
    title.innerHTML = categoryTitles[this.currentCategory] || 'Guia Espacial';

    // Aplica filtro de pesquisa
    if (this.searchQuery) {
      items = items.filter(item => {
        const text = `${item.name} ${item.subtitle || ''} ${item.type || ''} ${item.description || ''} ${item.achievement || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
        return text.includes(this.searchQuery);
      });
    }

    badge.textContent = `${items.length} ${items.length === 1 ? 'resultado' : 'descobertas'}`;

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="empty-search-state">
          <i class="fa-solid fa-satellite-dish"></i>
          <p>Nenhum astro ou astronauta encontrado para "${this.searchQuery}".</p>
          <span>Tente buscar por "Marte", "Buraco Negro", "Gagarin" ou "James Webb".</span>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'space-card';
      
      const tagsHtml = (item.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
      
      let badgeHtml = '';
      if (item.type) {
        badgeHtml = `<span class="card-type-badge">${item.type}</span>`;
      } else if (item.achievement) {
        badgeHtml = `<span class="card-type-badge">${item.achievement}</span>`;
      } else if (item.agency) {
        badgeHtml = `<span class="card-type-badge">${item.agency}</span>`;
      }

      card.innerHTML = `
        <div class="card-header-row">
          ${badgeHtml}
          <div class="card-actions-row">
            ${this.currentCategory === 'planets' ? `<button class="card-focus-3d-btn" title="Focar Câmera 3D"><i class="fa-solid fa-eye"></i></button>` : ''}
          </div>
        </div>
        <h3 class="card-title">${item.name}</h3>
        <p class="card-subtitle">${item.subtitle || item.country || item.location || ''}</p>
        <p class="card-excerpt">${item.description || item.biography || item.funFact}</p>
        <div class="card-tags-row">
          ${tagsHtml}
        </div>
        <button class="card-details-btn">
          <span>Ver Detalhes Completos</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      `;

      // Eventos de clique do cartão
      card.querySelector('.card-details-btn').addEventListener('click', () => {
        this.openItemModal(item);
      });

      if (this.currentCategory === 'planets') {
        const focusBtn = card.querySelector('.card-focus-3d-btn');
        if (focusBtn) {
          focusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectPlanet(item.id, true);
          });
        }
      }

      grid.appendChild(card);
    });
  }

  // Foco 3D e seleção de planeta
  selectPlanet(planetId, triggerSpeech = false) {
    if (this.threeScene) {
      this.threeScene.focusOnPlanet(planetId);
    }
    
    // Atualiza botão do seletor
    document.querySelectorAll('.planet-chip').forEach(c => {
      if (c.getAttribute('data-id') === planetId) {
        c.classList.add('chip-active');
        c.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      } else {
        c.classList.remove('chip-active');
      }
    });

    const planet = SPACE_DATA.planets.find(p => p.id === planetId);
    if (planet && triggerSpeech && this.bot) {
      this.bot.commentOnPlanet(planet);
    }
    this.playUiSound('select');
  }

  // Exibe modal detalhado com estatísticas e fatos
  openItemModal(item) {
    const modal = document.getElementById('infoModal');
    const content = document.getElementById('modalContent');
    this.playUiSound('modal');

    // Estatísticas dinâmicas em formato de grid cards
    let statsGrid = '';
    if (item.diameter) {
      statsGrid += `
        <div class="stat-box">
          <span class="stat-label"><i class="fa-solid fa-arrows-left-right"></i> Diâmetro</span>
          <span class="stat-val">${item.diameter}</span>
        </div>
      `;
    }
    if (item.distanceFromSun) {
      statsGrid += `
        <div class="stat-box">
          <span class="stat-label"><i class="fa-solid fa-sun"></i> Distância do Sol</span>
          <span class="stat-val">${item.distanceFromSun}</span>
        </div>
      `;
    }
    if (item.temperature) {
      statsGrid += `
        <div class="stat-box">
          <span class="stat-label"><i class="fa-solid fa-temperature-half"></i> Temperatura</span>
          <span class="stat-val">${item.temperature}</span>
        </div>
      `;
    }
    if (item.gravity) {
      statsGrid += `
        <div class="stat-box">
          <span class="stat-label"><i class="fa-solid fa-weight-hanging"></i> Gravidade</span>
          <span class="stat-val">${item.gravity}</span>
        </div>
      `;
    }
    if (item.dayDuration) {
      statsGrid += `
        <div class="stat-box">
          <span class="stat-label"><i class="fa-solid fa-clock"></i> Duração do Dia</span>
          <span class="stat-val">${item.dayDuration}</span>
        </div>
      `;
    }
    if (item.yearDuration) {
      statsGrid += `
        <div class="stat-box">
          <span class="stat-label"><i class="fa-solid fa-calendar"></i> Duração do Ano</span>
          <span class="stat-val">${item.yearDuration}</span>
        </div>
      `;
    }
    if (item.moons !== undefined) {
      statsGrid += `
        <div class="stat-box">
          <span class="stat-label"><i class="fa-solid fa-moon"></i> Luas Conhecidas</span>
          <span class="stat-val">${item.moons}</span>
        </div>
      `;
    }
    if (item.distance) {
      statsGrid += `
        <div class="stat-box">
          <span class="stat-label"><i class="fa-solid fa-ruler-horizontal"></i> Distância da Terra</span>
          <span class="stat-val">${item.distance}</span>
        </div>
      `;
    }
    if (item.mass) {
      statsGrid += `
        <div class="stat-box">
          <span class="stat-label"><i class="fa-solid fa-scale-balanced"></i> Massa Estimada</span>
          <span class="stat-val">${item.mass}</span>
        </div>
      `;
    }
    if (item.launchDate) {
      statsGrid += `
        <div class="stat-box">
          <span class="stat-label"><i class="fa-solid fa-rocket"></i> Lançamento</span>
          <span class="stat-val">${item.launchDate}</span>
        </div>
      `;
    }

    const quoteHtml = item.quote ? `
      <div class="modal-quote-box">
        <i class="fa-solid fa-quote-left quote-icon"></i>
        <p class="quote-text">"${item.quote}"</p>
      </div>
    ` : '';

    content.innerHTML = `
      <div class="modal-left-col">
        <span class="modal-badge">${item.type || item.achievement || item.agency || 'Objeto Espacial'}</span>
        <h2 class="modal-hero-title">${item.name}</h2>
        <p class="modal-hero-sub">${item.subtitle || item.country || item.location || ''}</p>
        
        ${quoteHtml}

        <div class="modal-funfact-box">
          <div class="funfact-title"><i class="fa-solid fa-lightbulb"></i> Curiosidade Cósmica Revelada</div>
          <p class="funfact-text">${item.funFact}</p>
        </div>

        <div class="modal-desc-body">
          <p>${item.description || item.biography}</p>
        </div>
      </div>

      <div class="modal-right-col">
        <h4 class="specs-title"><i class="fa-solid fa-chart-simple"></i> Dados & Parâmetros Físicos</h4>
        <div class="specs-grid">
          ${statsGrid}
        </div>
        
        ${item.diameter ? `
          <button class="modal-3d-fly-btn" id="btnModalFlyTo">
            <i class="fa-solid fa-crosshairs"></i> Voar Nave até ${item.name} em 3D
          </button>
        ` : ''}
      </div>
    `;

    // Botão de voo 3D a partir do modal
    const flyBtn = content.querySelector('#btnModalFlyTo');
    if (flyBtn) {
      flyBtn.addEventListener('click', () => {
        modal.classList.remove('modal-open');
        this.selectPlanet(item.id, true);
      });
    }

    modal.classList.add('modal-open');
  }

  // Ticker de Curiosidades Cósmicas em Tempo Real
  startLiveTicker() {
    this.updateTickerText();
    this.tickerInterval = setInterval(() => {
      this.nextLiveFact();
    }, 8500);
  }

  nextLiveFact() {
    this.tickerIndex = (this.tickerIndex + 1) % SPACE_DATA.curiosities.length;
    this.updateTickerText();
  }

  updateTickerText() {
    const el = document.getElementById('liveTickerText');
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    
    setTimeout(() => {
      el.textContent = SPACE_DATA.curiosities[this.tickerIndex];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 280);
  }

  // QUIZ CÓSMICO DO ASTROBOT
  openQuiz() {
    this.currentQuizIndex = 0;
    this.quizScore = 0;
    document.getElementById('quizModal').classList.add('modal-open');
    this.renderQuizStep();
    this.playUiSound('quiz');
  }

  renderQuizStep() {
    const q = SPACE_DATA.quizQuestions[this.currentQuizIndex];
    const total = SPACE_DATA.quizQuestions.length;
    this.quizAnswered = false;

    // Atualiza progresso e textos
    document.getElementById('quizStepTag').textContent = `Pergunta ${this.currentQuizIndex + 1} de ${total}`;
    document.getElementById('quizQuestionText').textContent = q.question;
    document.getElementById('quizScoreVal').textContent = `${this.quizScore} pts`;
    
    const progressPct = ((this.currentQuizIndex) / total) * 100;
    document.getElementById('quizProgressFill').style.width = `${progressPct}%`;
    document.getElementById('btnNextQuiz').style.display = 'none';

    // Lista de opções
    const optionsContainer = document.getElementById('quizOptionsList');
    optionsContainer.innerHTML = '';

    q.options.forEach((optText, idx) => {
      const optBtn = document.createElement('button');
      optBtn.className = 'quiz-option-btn';
      optBtn.innerHTML = `
        <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
        <span class="opt-text">${optText}</span>
        <i class="fa-solid fa-circle-check opt-status-icon"></i>
      `;

      optBtn.addEventListener('click', () => {
        if (this.quizAnswered) return;
        this.handleQuizAnswer(idx, optBtn, q);
      });

      optionsContainer.appendChild(optBtn);
    });
  }

  handleQuizAnswer(selectedIndex, selectedBtn, question) {
    this.quizAnswered = true;
    const isCorrect = selectedIndex === question.correctIndex;
    const options = document.querySelectorAll('.quiz-option-btn');

    options.forEach((btn, idx) => {
      btn.classList.add('option-disabled');
      if (idx === question.correctIndex) {
        btn.classList.add('option-correct');
      } else if (idx === selectedIndex && !isCorrect) {
        btn.classList.add('option-wrong');
      }
    });

    if (isCorrect) {
      this.quizScore += 100;
      document.getElementById('quizScoreVal').textContent = `${this.quizScore} pts`;
      this.playUiSound('success');

      // Chuva de confetes
      if (window.confetti) {
        window.confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      if (this.bot) {
        this.bot.say(`🎉 <strong>Correto! Bip bop!</strong> ${question.explanation}`);
        this.bot.playBotChirp([523, 659, 784, 1046]);
      }
    } else {
      this.playUiSound('wrong');
      if (this.bot) {
        this.bot.say(`Quase lá! Na verdade: ${question.explanation}`);
        this.bot.playBotChirp([400, 350, 300]);
      }
    }

    const nextBtn = document.getElementById('btnNextQuiz');
    const isLast = this.currentQuizIndex >= SPACE_DATA.quizQuestions.length - 1;
    nextBtn.innerHTML = isLast ? 'Concluir Desafio Cósmico <i class="fa-solid fa-trophy"></i>' : 'Próxima Pergunta <i class="fa-solid fa-arrow-right"></i>';
    nextBtn.style.display = 'inline-flex';
  }

  nextQuizQuestion() {
    this.currentQuizIndex++;
    if (this.currentQuizIndex < SPACE_DATA.quizQuestions.length) {
      this.renderQuizStep();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    const total = SPACE_DATA.quizQuestions.length * 100;
    const pct = Math.round((this.quizScore / total) * 100);
    const body = document.getElementById('quizBody');
    
    let rank = "Cadete Espacial";
    let message = "Continue estudando o cosmos para subir na frota galáctica!";
    if (pct >= 80) {
      rank = "Comandante Supremo da Frota Cósmica";
      message = "Incrível! Seus conhecimentos sobre o universo rivalizam com os telescópios mais avançados da NASA!";
    } else if (pct >= 50) {
      rank = "Navegador Interestelar";
      message = "Muito bom! Você já conhece os principais caminhos e mistérios do sistema solar!";
    }

    body.innerHTML = `
      <div class="quiz-final-card">
        <div class="trophy-glow"><i class="fa-solid fa-award"></i></div>
        <h2>Desafio Concluído!</h2>
        <div class="rank-badge">${rank}</div>
        <p class="final-score-text">Você acumulou <strong>${this.quizScore} de ${total} pontos</strong> (${pct}% de acerto)!</p>
        <p class="final-subtext">${message}</p>
        <button class="bot-action-btn primary-action-btn" id="btnRestartQuiz">
          <i class="fa-solid fa-rotate-right"></i> Jogar Novamente
        </button>
      </div>
    `;

    document.getElementById('btnNextQuiz').style.display = 'none';
    document.getElementById('quizProgressFill').style.width = '100%';

    document.getElementById('btnRestartQuiz').addEventListener('click', () => {
      this.openQuiz();
    });

    if (window.confetti && pct >= 50) {
      window.confetti({ particleCount: 100, spread: 90 });
    }
  }

  // SINTETIZADOR DE ÁUDIO WEB AUDIO API (Totalmente nativo)
  toggleAudio(btnEl) {
    this.audioEnabled = !this.audioEnabled;

    if (this.audioEnabled) {
      this.startAmbientSpaceDrone();
      btnEl.classList.add('audio-active');
      btnEl.querySelector('span').textContent = 'Áudio: ON';
      if (this.bot) this.bot.say("Frequências de áudio espacial conectadas! Sons do éter ativados. 🎧");
    } else {
      this.stopAmbientSpaceDrone();
      btnEl.classList.remove('audio-active');
      btnEl.querySelector('span').textContent = 'Áudio: OFF';
    }
  }

  getAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  startAmbientSpaceDrone() {
    try {
      const ctx = this.getAudioContext();
      // Oscilador senoidal grave relaxante
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // Nota Lá grave (A1)
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110, ctx.currentTime); // Oitava suave (A2)

      gain.gain.setValueAtTime(0.045, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.ambientSoundNode = { osc1, osc2, gain };
    } catch (e) {
      console.warn('Falha ao iniciar áudio ambiente:', e);
    }
  }

  stopAmbientSpaceDrone() {
    if (this.ambientSoundNode) {
      try {
        this.ambientSoundNode.osc1.stop();
        this.ambientSoundNode.osc2.stop();
      } catch (e) {}
      this.ambientSoundNode = null;
    }
  }

  playUiSound(type) {
    if (!this.audioEnabled) return;
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'select') {
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'warp') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'radar') {
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(1046, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.25);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {}
  }
}

// Inicializa a aplicação assim que o DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
  window.cosmoApp = new CosmoApp();
});
