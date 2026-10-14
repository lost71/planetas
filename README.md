# 🪐 CosmoPedia 3D - Enciclopédia Interativa do Universo & AstroBot

Um sistema solar e enciclopédia cósmica interativa construída com **Three.js**, **Web Audio API** e **JavaScript moderno**, repleta de animações fluidas, efeitos de partículas do mouse e o adorável robô copiloto **Cosmo-X**.

---

## 🚀 Funcionalidades Principais

### 1. 🌌 Sistema Solar 3D em Tempo Real
- **Cena 3D com Three.js**: Sol com corona pulsante, todos os 8 planetas do Sistema Solar + Plutão com luas e órbitas luminosas.
- **Texturas Procedurais HD em Canvas**: Anéis de Saturno realistas com divisão de Cassini, calotas polares em Marte, Grande Mancha Vermelha de Júpiter e continentes/oceanos terrestres.
- **Navegação Inteligente de Câmera**:
  - Arraste com o botão esquerdo para girar a visão orbital.
  - Role a roda do mouse para zoom in/out.
  - Clique diretamente em qualquer planeta ou no seletor rápido para a câmera voar em direção a ele (*camera lerp*).
- **Modo Hiperespaço / Velocidade da Luz**: Acelera o tempo e estica as estrelas cósmicas em um efeito de dobra espacial deslumbrante.

### 2. 🤖 AstroBot ("Cosmo-X") - O Robô Companheiro Interativo
- **Rastreamento Ocular**: Os olhinhos expressivos do robô acompanham o cursor do mouse em tempo real por onde ele passar na tela.
- **Interação Fofa**: Ao clicar no robô, ele faz um salto mortal 360°, cora as bochechas, solta confetes e bips sonoros fofos.
- **Modo "Me Seguir"**: O robô voa com propulsor a jato flutuando ao lado do cursor do mouse como seu fiel copiloto.
- **Easter Egg de Tontura**: Gire o mouse em círculos rápidos ao redor dele para deixá-lo tonto com olhinhos `@_@`.
- **Voz Robótica Procedural**: Bips futuristas gerados dinamicamente via *Web Audio API* (estilo R2-D2 e Wall-E).
- **Curiosidades e Segredos**: Conta piadas e segredos fascinantes sobre o espaço.

### 3. ✨ Mouse Super Interativo & Gravidade
- **Trilha de Poeira Estelar (Stardust Trail)**: Partículas cintilantes em tons ciano, roxo e dourado que reagem à velocidade do mouse.
- **Ondas Gravitacionais**: Ao clicar em qualquer ponto da tela, uma onda de choque gravitacional se expande com partículas estelares.
- **Cursor Cósmico Personalizado**: Mira e anel inercial futurista.

### 4. 🛰️ Radar Cósmico ao Vivo (Live Ticker)
- Transmissão contínua no topo da página atualizando curiosidades espaciais em tempo real a cada poucos segundos, com botão de busca manual de dados.

### 5. 📚 Enciclopédia Multicategoria
- **Planetas do Sistema Solar**: Dados científicos reais (temperatura, massa, período orbital, gravidade, curiosidades).
- **Exoplanetas**: TRAPPIST-1e, Próxima Centauri b, WASP-76b (chuva de ferro líquido), 55 Cancri e (planeta de diamante) e HD 189733b (chuva de vidro supersônica).
- **Astronautas & Heroínas do Espaço**: Yuri Gagarin, Neil Armstrong, Valentina Tereshkova, Marcos Pontes, Peggy Whitson, Chris Hadfield.
- **Astros & Mistérios Cósmicos**: Buraco Negro Sagitário A*, Pilares da Criação, Magnetares e o Grande Atrator.
- **Missões & Telescópios**: Telescópio James Webb, Voyager 1 & 2, ISS e Programa Artemis.

### 6. 🏆 Quiz Cósmico Interativo
- Desafio de perguntas e respostas com pontuação, explicações detalhadas de cada resposta e chuva de confetes comandada pelo Cosmo-X!

---

## 💻 Como Rodar Localmente

Caso queira iniciar novamente o servidor em outro momento, basta abrir o terminal na pasta do projeto e executar:

```powershell
python -m http.server 3000
```

E acessar no seu navegador: `http://localhost:3000` (ou simplesmente dar duplo clique no arquivo `index.html`!).
