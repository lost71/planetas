/**
 * Cosmo-X: O Robô Astronauta Companheiro Interativo
 * Inclui: Rastreamento ocular dos movimentos do mouse, modo de voo em órbita do cursor,
 * reações emotivas (piscar, corar, tontura), diálogos cósmicos e sintetizador de voz robótica.
 */

class AstroBot {
  constructor() {
    this.wrapper = document.getElementById('astroBotWrapper');
    this.avatar = document.getElementById('robotAvatar');
    this.speechBubble = document.getElementById('robotSpeech');
    this.speechMessage = document.getElementById('robotMessage');
    this.eyeLeft = document.getElementById('eyeLeft');
    this.eyeRight = document.getElementById('eyeRight');
    this.mouth = document.getElementById('robotMouth');
    this.reactor = document.getElementById('robotReactor');
    
    // Botões do robô
    this.btnSecret = document.getElementById('btnBotTellSecret');
    this.btnQuiz = document.getElementById('btnBotQuiz');
    this.btnFollow = document.getElementById('btnBotFollowMouse');

    // Estados
    this.isFollowingMouse = false;
    this.isDizzy = false;
    this.speechTimeout = null;
    this.posX = window.innerWidth - 220;
    this.posY = window.innerHeight - 260;
    this.targetX = this.posX;
    this.targetY = this.posY;
    this.mouseSpeed = 0;
    this.lastMousePos = { x: 0, y: 0 };
    this.dizzyCounter = 0;

    // Banco de falas e piadas espaciais
    this.secretsAndJokes = [
      "Bip bop! Sabia que se você chorar no espaço, as lágrimas formam bolhas d'água gelatinosas presas nos olhos?",
      "Piadinha cósmica: Qual é a bebida favorita dos astronautas? O Chá-steroide! *bip bip*",
      "Você sabia que um dia em Vênus é mais longo que um ano inteiro em Vênus? Meus circuitos piram só de pensar!",
      "Minha antena captou que em Saturno e Netuno chove diamantes maciços! Quero programar minhas férias para lá!",
      "Curiosidade: Astronautas da ISS chegam a crescer 5 cm de pura altura porque a gravidade não esmaga a coluna!",
      "Bip! Se colocássemos Saturno numa piscina cósmica gigante, ele flutuaria como uma boia amarela!",
      "Minha memória temabytes adora lembrar: Neil Armstrong pousou na Lua com apenas 25 segundos de combustível restante!",
      "Você sabia que o cheiro do espaço é relatado como bife tostado e metal quente? Quase parece um churrasco robótico!",
      "Dica de copiloto: Clique duas vezes em qualquer planeta da lista para a câmera da nave mergulhar direto nele!",
      "No exoplaneta WASP-76b chove ferro líquido fundido do céu. Nunca esqueça o guarda-chuva de titânio!"
    ];

    this.init();
  }

  init() {
    // Posiciona inicialmente no canto inferior direito de forma harmoniosa
    this.updatePosition(this.posX, this.posY);

    // Rastreamento dos Olhos em relação ao cursor
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Clique no avatar do robô (interação fofa / carinho)
    this.avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      this.doCuteReaction();
    });

    // Ações dos botões da caixa de diálogo
    if (this.btnSecret) {
      this.btnSecret.addEventListener('click', () => this.tellRandomSecret());
    }
    if (this.btnQuiz) {
      this.btnQuiz.addEventListener('click', () => {
        if (window.cosmoApp) window.cosmoApp.openQuiz();
      });
    }
    if (this.btnFollow) {
      this.btnFollow.addEventListener('click', () => this.toggleFollowMouse());
    }

    // Piscar de olhos natural a cada 3 a 6 segundos
    setInterval(() => this.blinkEyes(), 4200);

    // Loop de física suave para voo e acompanhamento
    this.updateLoop = this.updateLoop.bind(this);
    requestAnimationFrame(this.updateLoop);
  }

  onMouseMove(e) {
    // 1. Calcula a direção para as pupilas olharem para o cursor
    const rect = this.avatar.getBoundingClientRect();
    const botCenterX = rect.left + rect.width / 2;
    const botCenterY = rect.top + rect.height / 2;

    const deltaX = e.clientX - botCenterX;
    const deltaY = e.clientY - botCenterY;
    const angle = Math.atan2(deltaY, deltaX);
    const dist = Math.hypot(deltaX, deltaY);
    
    // Limite máximo de deslocamento das pupilas dentro do visor
    const maxPupilOffset = 6;
    const offset = Math.min(dist * 0.05, maxPupilOffset);
    const pupilX = Math.cos(angle) * offset;
    const pupilY = Math.sin(angle) * offset;

    const pupils = this.avatar.querySelectorAll('.pupil');
    pupils.forEach(pupil => {
      pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    });

    // 2. Rastreamento de rotações rápidas para ficar tonto (Dizzy Easter Egg)
    const mouseDelta = Math.hypot(e.clientX - this.lastMousePos.x, e.clientY - this.lastMousePos.y);
    this.lastMousePos = { x: e.clientX, y: e.clientY };

    if (dist < 150 && mouseDelta > 28) {
      this.dizzyCounter++;
      if (this.dizzyCounter > 30 && !this.isDizzy) {
        this.triggerDizziness();
      }
    } else {
      this.dizzyCounter = Math.max(0, this.dizzyCounter - 1);
    }

    // 3. Se estiver em modo de seguir mouse
    if (this.isFollowingMouse) {
      // Flutua a uma distância confortável do mouse (offset para não cobrir o clique)
      this.targetX = e.clientX + 35;
      this.targetY = e.clientY - 45;

      // Limita dentro da viewport visível
      this.targetX = Math.max(20, Math.min(window.innerWidth - 180, this.targetX));
      this.targetY = Math.max(20, Math.min(window.innerHeight - 200, this.targetY));
    }
  }

  updateLoop() {
    requestAnimationFrame(this.updateLoop);

    if (this.isFollowingMouse) {
      // Interpolação suave para acompanhar o mouse (estilo flutuação gravitacional)
      const dx = this.targetX - this.posX;
      const dy = this.targetY - this.posY;

      this.posX += dx * 0.07;
      this.posY += dy * 0.07;

      // Inclina o corpinho do robô na direção da aceleração
      const tilt = Math.max(-18, Math.min(18, dx * 0.4));
      this.wrapper.style.transform = `translate3d(${this.posX}px, ${this.posY}px, 0) rotate(${tilt}deg)`;
    }
  }

  updatePosition(x, y) {
    this.posX = x;
    this.posY = y;
    this.wrapper.style.transform = `translate3d(${this.posX}px, ${this.posY}px, 0)`;
  }

  toggleFollowMouse() {
    this.isFollowingMouse = !this.isFollowingMouse;
    if (this.isFollowingMouse) {
      this.btnFollow.innerHTML = '<i class="fa-solid fa-anchor"></i> Ficar Parado';
      this.btnFollow.classList.add('active-bot-btn');
      this.say("Segurando propulsores! Estou orbitando você agora, comandante! ✨");
      this.playBotChirp([440, 660, 880]);
    } else {
      this.btnFollow.innerHTML = '<i class="fa-solid fa-magnet"></i> Me Seguir';
      this.btnFollow.classList.remove('active-bot-btn');
      // Retorna para o canto original
      this.targetX = window.innerWidth - 220;
      this.targetY = window.innerHeight - 260;
      this.say("Voltando para minha base de observação estelar! 🚀");
      this.playBotChirp([880, 660, 440]);
    }
  }

  blinkEyes() {
    if (this.isDizzy) return;
    this.eyeLeft.classList.add('eye-blink');
    this.eyeRight.classList.add('eye-blink');
    setTimeout(() => {
      this.eyeLeft.classList.remove('eye-blink');
      this.eyeRight.classList.remove('eye-blink');
    }, 180);
  }

  triggerDizziness() {
    this.isDizzy = true;
    this.avatar.classList.add('bot-dizzy-anim');
    this.mouth.textContent = "o_O";
    this.say("Uoooou! Velocidade de rotação máxima... Meus giroscópios estão tontos! @__@");
    this.playBotChirp([300, 260, 220, 180]);

    setTimeout(() => {
      this.isDizzy = false;
      this.avatar.classList.remove('bot-dizzy-anim');
      this.mouth.textContent = "";
      this.dizzyCounter = 0;
    }, 3500);
  }

  doCuteReaction() {
    // Animação de pirueta de 360 graus e corações/brilhos
    this.avatar.classList.add('bot-spin-happy');
    this.playBotChirp([523, 659, 784, 1046]); // Acorde C Maior alegre!
    
    // Pequeno confete ao fazer carinho
    if (window.confetti) {
      const rect = this.avatar.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      window.confetti({
        particleCount: 15,
        spread: 45,
        origin: { x, y },
        colors: ['#00ffff', '#ff77aa', '#ffff00']
      });
    }

    const cuteLines = [
      "Bip bop! Hehe, isso faz cócegas nas minhas engrenagens!",
      "Nível de carinho: 100%! Bateria recarregada com sucesso! ❤️",
      "Propulsores ativados! Sou o robô mais veloz da galáxia!",
      "Bzzzt! Adoro explorar o espaço ao seu lado, Comandante!",
      "Pronto para decolar! O que vamos descobrir hoje?"
    ];
    const picked = cuteLines[Math.floor(Math.random() * cuteLines.length)];
    this.say(picked);

    setTimeout(() => {
      this.avatar.classList.remove('bot-spin-happy');
    }, 800);
  }

  tellRandomSecret() {
    const secret = this.secretsAndJokes[Math.floor(Math.random() * this.secretsAndJokes.length)];
    this.say(secret);
    this.playBotChirp([587, 880, 1174]);
  }

  commentOnPlanet(planet) {
    const comments = [
      `Uau! Esse é <strong>${planet.name}</strong>! ${planet.funFact}`,
      `Mirando sensores em <strong>${planet.name}</strong>! Sabia que a temperatura lá é de ${planet.temperature}?`,
      `Incrível aproximação de <strong>${planet.name}</strong>! ${planet.subtitle}.`
    ];
    const picked = comments[Math.floor(Math.random() * comments.length)];
    this.say(picked);
    this.playBotChirp([600, 750, 900]);
  }

  say(message) {
    if (this.speechTimeout) clearTimeout(this.speechTimeout);
    
    this.speechMessage.innerHTML = message;
    this.speechBubble.classList.add('bubble-show');

    // Mantém aberto por tempo proporcional ao texto
    const duration = Math.max(5000, message.length * 75);
    this.speechTimeout = setTimeout(() => {
      // Não fecha se estiver em quiz
      if (!document.getElementById('quizModal').classList.contains('modal-open')) {
        this.speechBubble.classList.remove('bubble-show');
      }
    }, duration);
  }

  // Sintetizador de áudio de bips fofos usando Web Audio API
  playBotChirp(freqs = [440, 880]) {
    try {
      const audioCtx = window.cosmoAudioCtx || (window.cosmoAudioCtx = new (window.AudioContext || window.webkitAudioContext)());
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      freqs.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.08);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (index + 1) * 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + index * 0.08);
        osc.stop(audioCtx.currentTime + (index + 1) * 0.08);
      });
    } catch (e) {
      // Ignora silenciosamente em navegadores sem suporte
    }
  }
}

window.AstroBot = AstroBot;
