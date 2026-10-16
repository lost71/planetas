/**
 * Banco de Dados Extensivo de Astros, Planetas, Astronautas, Missões e Curiosidades Cósmicas
 */

const SPACE_DATA = {
  // 1. SISTEMA SOLAR
  planets: [
    {
      id: "sun",
      name: "Sol",
      subtitle: "A Estrela Central do Nosso Sistema",
      type: "Estrela Anã Amarela (G2V)",
      color: "#ffaa00",
      secondaryColor: "#ff4400",
      diameter: "1.392.700 km (109 Terras)",
      distanceFromSun: "0 km (Centro)",
      dayDuration: "25 a 35 dias terrestres (rotação diferencial)",
      yearDuration: "230 milhões de anos (Ano Galáctico)",
      moons: 0,
      temperature: "5.500 °C (Superfície) / 15.000.000 °C (Núcleo)",
      gravity: "274 m/s² (28x a gravidade da Terra)",
      funFact: "O Sol queima cerca de 600 milhões de toneladas de hidrogênio por segundo através de fusão nuclear e representa 99,86% de toda a massa do Sistema Solar!",
      description: "O Sol é o coração vivo do nosso sistema planetário. Sua atração gravitacional mantém todos os planetas, asteroides e cometas em órbita contínua, fornecendo luz, calor e a energia essencial para a vida na Terra.",
      imageKeyword: "sun",
      tags: ["Estrela", "Fusão Nuclear", "Centro"]
    },
    {
      id: "mercury",
      name: "Mercúrio",
      subtitle: "O Mensageiro Veloz e Fornalha Gélida",
      type: "Planeta Rochoso",
      color: "#a8a8a8",
      secondaryColor: "#666666",
      diameter: "4.879 km",
      distanceFromSun: "57,9 milhões de km",
      dayDuration: "59 dias terrestres",
      yearDuration: "88 dias terrestres",
      moons: 0,
      temperature: "-180 °C (Noite) até +430 °C (Dia)",
      gravity: "3,7 m/s² (0,38x Terra)",
      funFact: "Por não ter atmosfera para reter calor, Mercúrio sofre a oscilação térmica mais violenta do sistema solar: varia mais de 600 °C entre o dia e a noite!",
      description: "Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol. Sua superfície cheia de crateras lembra a nossa Lua e ele viaja a incríveis 170.000 km/h pelo espaço.",
      imageKeyword: "mercury",
      tags: ["Rochoso", "Mais Rápido", "Extremo Térmico"]
    },
    {
      id: "venus",
      name: "Vênus",
      subtitle: "A Estrela D'Alva e o Inferno de Efeito Estufa",
      type: "Planeta Rochoso",
      color: "#e3bb76",
      secondaryColor: "#b27329",
      diameter: "12.104 km",
      distanceFromSun: "108,2 milhões de km",
      dayDuration: "243 dias terrestres (Gira ao contrário!)",
      yearDuration: "225 dias terrestres",
      moons: 0,
      temperature: "+465 °C (Mais quente que Mercúrio!)",
      gravity: "8,87 m/s² (0,9x Terra)",
      funFact: "Em Vênus, um único dia é mais longo do que um ano inteiro no planeta! Além disso, chove ácido sulfúrico e a pressão esmagadora equivale a 900 metros no fundo do oceano terrestre.",
      description: "Embora seja semelhante em tamanho à Terra, Vênus é um mundo tóxico com nuvens densas de ácido sulfúrico e um efeito estufa descontrolado capaz de derreter chumbo sólido na superfície.",
      imageKeyword: "venus",
      tags: ["Rochoso", "Mais Quente", "Rotação Retrógrada"]
    },
    {
      id: "earth",
      name: "Terra",
      subtitle: "O Oásis Azul e Lar da Humanidade",
      type: "Planeta Rochoso Habitável",
      color: "#2a75d3",
      secondaryColor: "#3da658",
      diameter: "12.742 km",
      distanceFromSun: "149,6 milhões de km (1 UA)",
      dayDuration: "23 horas e 56 minutos",
      yearDuration: "365,25 dias",
      moons: 1, // A Lua
      temperature: "Média de 15 °C (-89 °C a +58 °C)",
      gravity: "9,807 m/s² (1G)",
      funFact: "A Terra é o único lugar conhecido no Universo onde a água coexiste em seus três estados físicos: sólido (gelo), líquido e gasoso (vapor), permitindo a exuberância biológica.",
      description: "Nosso lar cósmico é um prodígio raro: protegido por um campo magnético potente contra ventos solares, atmosfera rica em nitrogênio e oxigênio e oceanos líquidos que cobrem 71% da superfície.",
      imageKeyword: "earth",
      tags: ["Vida", "Água Líquida", "Nossa Casa"]
    },
    {
      id: "mars",
      name: "Marte",
      subtitle: "O Planeta Vermelho e Próxima Fronteira",
      type: "Planeta Rochoso",
      color: "#d14b28",
      secondaryColor: "#8e2b11",
      diameter: "6.779 km",
      distanceFromSun: "227,9 milhões de km",
      dayDuration: "24 horas e 37 minutos (Sol)",
      yearDuration: "687 dias terrestres",
      moons: 2, // Fobos e Deimos
      temperature: "-140 °C a +20 °C (Média -63 °C)",
      gravity: "3,72 m/s² (0,38x Terra)",
      funFact: "Marte abriga o Monte Olimpo, o maior vulcão do Sistema Solar, com 22 km de altura (quase 3 vezes mais alto que o Monte Everest) e base do tamanho da França!",
      description: "Com solo avermelhado rico em óxido de ferro (ferrugem), calotas polares de gelo e dióxido de carbono e leitos secos de rios antigos, Marte é o principal alvo da busca por vida extraterrestre passada.",
      imageKeyword: "mars",
      tags: ["Vermelho", "Monte Olimpo", "Rovers"]
    },
    {
      id: "jupiter",
      name: "Júpiter",
      subtitle: "O Rei dos Planetas e Escudo Gravitacional",
      type: "Gigante Gasoso",
      color: "#d9a066",
      secondaryColor: "#c26d36",
      diameter: "139.820 km (11 Terras alinhadas)",
      distanceFromSun: "778,5 milhões de km",
      dayDuration: "9 horas e 55 minutos (O mais veloz!)",
      yearDuration: "11,86 anos terrestres",
      moons: 95, // Europa, Ganimedes, Calisto, Io...
      temperature: "-110 °C (Camada superior de nuvens)",
      gravity: "24,79 m/s² (2,5x Terra)",
      funFact: "A famosa 'Grande Mancha Vermelha' de Júpiter é uma tempestade colossal que ruge há mais de 350 anos e é grande o suficiente para engolir a Terra inteira com facilidade!",
      description: "Júpiter é tão massivo que possui mais do dobro da massa de todos os outros planetas do sistema solar somados. Ele atua como um 'aspirador de pó' cósmico, atraindo cometas perigosos para longe da Terra.",
      imageKeyword: "jupiter",
      tags: ["Gigante Gasoso", "Grande Mancha", "95 Luas"]
    },
    {
      id: "saturn",
      name: "Saturno",
      subtitle: "A Joia dos Anéis Majestosos",
      type: "Gigante Gasoso",
      color: "#e2bf7d",
      secondaryColor: "#c49a45",
      diameter: "116.460 km",
      distanceFromSun: "1,43 bilhão de km",
      dayDuration: "10 horas e 33 minutos",
      yearDuration: "29,45 anos terrestres",
      moons: 146, // Titã, Encélado, Mimas...
      temperature: "-140 °C",
      gravity: "10,44 m/s² (1,06x Terra)",
      funFact: "Saturno é tão pouco denso que é o único planeta que flutuaria na água se existisse uma banheira cósmica grande o bastante para colocá-lo dentro!",
      description: "Famoso por seu espetacular sistema de anéis composto por bilhões de pedaços de gelo puro e rochas, Saturno possui a lua Titã (com lagos de metano) e Encélado (com gêiseres de água líquida subsuperficiais).",
      imageKeyword: "saturn",
      tags: ["Anéis Espetaculares", "Flutuaria na Água", "146 Luas"]
    },
    {
      id: "uranus",
      name: "Urano",
      subtitle: "O Gigante de Gelo que Rola de Lado",
      type: "Gigante de Gelo",
      color: "#72d5db",
      secondaryColor: "#429b9f",
      diameter: "50.724 km",
      distanceFromSun: "2,87 bilhões de km",
      dayDuration: "17 horas e 14 minutos",
      yearDuration: "84 anos terrestres",
      moons: 28,
      temperature: "-224 °C (O planeta mais frio do sistema)",
      gravity: "8,69 m/s² (0,89x Terra)",
      funFact: "Urano gira completamente 'deitado' com uma inclinação de 98 graus, provavelmente resultado de uma colisão cósmica catastrófica com um protoplaneta no início da formação do sistema!",
      description: "Urano deve sua linda tonalidade azul-esverdeada ao gás metano presente na sua alta atmosfera. É um mundo gelado de água, amônia e fluidos de metano sobre um núcleo rochoso diminuto.",
      imageKeyword: "uranus",
      tags: ["Gigante de Gelo", "Gira deitado", "Recorde de Frio"]
    },
    {
      id: "neptune",
      name: "Netuno",
      subtitle: "O Deus dos Mares e dos Ventos Supersônicos",
      type: "Gigante de Gelo",
      color: "#3f54d1",
      secondaryColor: "#1d2e8e",
      diameter: "49.244 km",
      distanceFromSun: "4,5 bilhões de km (30 UA)",
      dayDuration: "16 horas e 6 minutos",
      yearDuration: "165 anos terrestres",
      moons: 16, // Tritão...
      temperature: "-214 °C",
      gravity: "11,15 m/s² (1,14x Terra)",
      funFact: "Netuno possui os ventos mais furiosos de todo o Sistema Solar, ultrapassando 2.100 km/h — mais velozes do que o som na Terra e capazes de rasgar qualquer objeto!",
      description: "Netuno é o planeta mais distante do Sol reconhecido oficialmente. Sua lua gigante, Tritão, orbita na direção contrária do planeta e cospe nitrogênio líquido congelado em gêiseres cósmicos.",
      imageKeyword: "neptune",
      tags: ["Azul Profundo", "Ventos 2100 km/h", "Fronteira Externa"]
    },
    {
      id: "pluto",
      name: "Plutão",
      subtitle: "O Planeta Anão com Coração de Gelo",
      type: "Planeta Anão do Cinturão de Kuiper",
      color: "#c9a383",
      secondaryColor: "#825d40",
      diameter: "2.376 km (Menor que a nossa Lua)",
      distanceFromSun: "5,9 bilhões de km (39 UA)",
      dayDuration: "153 horas (6,4 dias terrestres)",
      yearDuration: "248 anos terrestres",
      moons: 5,
      temperature: "-230 °C",
      gravity: "0,62 m/s² (0,06x Terra)",
      funFact: "A sonda New Horizons revelou que Plutão possui uma gigantesca geleira de nitrogênio em formato de coração, chamada 'Tombaugh Regio', com montanhas de gelo de 3.500 metros de altura!",
      description: "Reclassificado em 2006 como planeta anão, Plutão continua sendo um dos mundos mais fascinantes e amados da astronomia, dançando em órbita binária com sua imensa lua Caronte.",
      imageKeyword: "pluto",
      tags: ["Planeta Anão", "Coração de Gelo", "Cinturão de Kuiper"]
    },
    {
      id: "ceres",
      name: "Ceres",
      subtitle: "A Rainha Misteriosa do Cinturão de Asteroides",
      type: "Planeta Anão Rochoso",
      color: "#b0aba0",
      secondaryColor: "#5c5850",
      diameter: "939 km",
      distanceFromSun: "414 milhões de km (2,8 UA)",
      dayDuration: "9 horas terrestres",
      yearDuration: "4,6 anos terrestres",
      moons: 0,
      temperature: "-106 °C a -38 °C",
      gravity: "0,28 m/s² (0,03x Terra)",
      funFact: "Ceres contém quase um terço de toda a massa do cinturão de asteroides e possui criovulcões que cospem gelo e depósitos brilhantes de carbonato de sódio!",
      description: "O maior objeto entre Marte e Júpiter e o único planeta anão localizado no Sistema Solar interno. Sob sua crosta rochosa pode existir um vasto oceano subterrâneo congelado.",
      imageKeyword: "ceres",
      tags: ["Planeta Anão", "Cinturão de Asteroides", "Criovulcões"]
    },
    {
      id: "haumea",
      name: "Haumea",
      subtitle: "O Planeta Anão em Forma de Bola de Rugby com Anel",
      type: "Planeta Anão Transnetuniano",
      color: "#cbd5e1",
      secondaryColor: "#64748b",
      diameter: "1.632 × 1.100 km (Elipsoide)",
      distanceFromSun: "6,4 bilhões de km (43 UA)",
      dayDuration: "3,9 horas (O giro mais rápido do sistema)",
      yearDuration: "284 anos terrestres",
      moons: 2,
      temperature: "-241 °C",
      gravity: "0,4 m/s²",
      funFact: "Haumea gira tão assustadoramente rápido (uma volta a cada 3,9 horas) que a força centrífuga esticou o astro no formato de uma bola de futebol americano!",
      description: "Descoberto em 2004, Haumea é cercado por um anel estreito e cristais de gelo puro em sua superfície reluzente.",
      imageKeyword: "haumea",
      tags: ["Planeta Anão", "Formato Oval", "Possui Anel"]
    },
    {
      id: "makemake",
      name: "Makemake",
      subtitle: "O Mundo Escarlate de Metano Congelado",
      type: "Planeta Anão Transnetuniano",
      color: "#ea580c",
      secondaryColor: "#7c2d12",
      diameter: "1.430 km",
      distanceFromSun: "6,8 bilhões de km (45,8 UA)",
      dayDuration: "22,5 horas",
      yearDuration: "305 anos terrestres",
      moons: 1,
      temperature: "-243 °C",
      gravity: "0,5 m/s²",
      funFact: "Batizado em homenagem ao deus criador do povo Rapa Nui da Ilha de Páscoa, sua superfície avermelhada é coberta por camadas de metano e etano congelados!",
      description: "O segundo objeto mais brilhante do Cinturão de Kuiper depois de Plutão, iluminando fracamente a escuridão dos limites do nosso sistema planetário.",
      imageKeyword: "makemake",
      tags: ["Planeta Anão", "Cinturão de Kuiper", "Metano Congelado"]
    },
    {
      id: "eris",
      name: "Éris",
      subtitle: "O Gigante Gélido que Redefiniu a Astronomia",
      type: "Planeta Anão do Disco Disperso",
      color: "#bae6fd",
      secondaryColor: "#0284c7",
      diameter: "2.326 km (27% mais massivo que Plutão)",
      distanceFromSun: "10,1 bilhões de km (68 UA)",
      dayDuration: "25,9 horas",
      yearDuration: "558 anos terrestres",
      moons: 1,
      temperature: "-243 °C a -218 °C",
      gravity: "0,82 m/s²",
      funFact: "A descoberta de Éris em 2005 por Mike Brown provocou o grande debate internacional que levou a União Astronômica Internacional a criar a categoria de 'Planeta Anão'!",
      description: "Éris é o planeta anão mais massivo conhecido no Sistema Solar, orbitando três vezes mais longe do Sol que Plutão em uma órbita inclinada espetacular.",
      imageKeyword: "eris",
      tags: ["Planeta Anão", "Disco Disperso", "Hiper-Gélido"]
    },
    {
      id: "kepler-452b",
      name: "Kepler-452b",
      subtitle: "A Superterra Prima Mais Velha do Nosso Mundo",
      type: "Exoplaneta na Zona Habitável",
      color: "#10b981",
      secondaryColor: "#047857",
      diameter: "19.000 km (1,6x Terra)",
      distanceFromSun: "1.400 anos-luz (Constelação de Cisne)",
      dayDuration: "Desconhecido",
      yearDuration: "385 dias terrestres (Quase idêntico à Terra!)",
      moons: 0,
      temperature: "Aprox. -8 °C a +20 °C estimada",
      gravity: "19,6 m/s² (2x Terra)",
      funFact: "Seu ano dura 385 dias e sua estrela-mãe é uma anã amarela quase gêmea do nosso Sol, mas 1,5 bilhão de anos mais velha!",
      description: "Apelidado carinhosamente de 'Terra 2.0', Kepler-452b orbita na zona habitável onde oceanos de água líquida podem existir há bilhões de anos.",
      imageKeyword: "kepler",
      tags: ["Exoplaneta", "Zona Habitável", "Terra 2.0"]
    },
    {
      id: "wasp-76b",
      name: "WASP-76b",
      subtitle: "O Gigante Infernal Onde Chove Ferro Líquido",
      type: "Júpiter Ultra-Quente",
      color: "#a855f7",
      secondaryColor: "#dc2626",
      diameter: "260.000 km (1,8x Júpiter)",
      distanceFromSun: "634 anos-luz (Constelação de Peixes)",
      dayDuration: "Preso por maré (Sempre a mesma face pro sol)",
      yearDuration: "1,8 dias terrestres",
      moons: 0,
      temperature: "+2.400 °C (Dia) / +1.500 °C (Noite)",
      gravity: "12,5 m/s²",
      funFact: "No lado diurno a temperatura é tão insana que o ferro metálico evapora na atmosfera; os ventos sopram esse vapor para a noite gélida, onde ele condensa e cai como chuva de ferro líquido fundido!",
      description: "Um dos mundos mais exóticos e violentos já detectados pela astrofísica moderna, fascinando observadores do telescópio espacial James Webb.",
      imageKeyword: "wasp",
      tags: ["Exoplaneta", "Chuva de Ferro", "Extremo Cósmico"]
    }
  ],

  // 2. EXOPLANETAS FASCINANTES
  exoplanets: [
    {
      id: "proxima-b",
      name: "Próxima Centauri b",
      subtitle: "O Vizinho Mais Próximo da Terra",
      type: "Superterra na Zona Habitável",
      color: "#e67e22",
      distance: "4,24 anos-luz da Terra",
      discovered: "2016",
      star: "Próxima Centauri (Anã Vermelha)",
      orbitalPeriod: "11,2 dias",
      mass: "1,17 massas terrestres",
      funFact: "É o planeta extrassolar mais próximo do Sistema Solar! Uma sonda a 20% da velocidade da luz (como o projeto Breakthrough Starshot) levaria cerca de 20 anos para chegar até lá.",
      description: "Localizado na zona habitável de sua estrela, Próxima b poderia teoricamente abrigar água líquida, embora seja fustigado por rajadas de radiação e erupções ultravioleta de sua anã vermelha.",
      tags: ["Mais Próximo", "Zona Habitável", "Futura Exploração"]
    },
    {
      id: "trappist-1e",
      name: "TRAPPIST-1e",
      subtitle: "O Candidato Ideal para Oceanos Líquidos",
      type: "Planeta Rochoso Temperado",
      color: "#3498db",
      distance: "39,5 anos-luz (Constelação de Aquário)",
      discovered: "2017",
      star: "TRAPPIST-1 (Anã Ultrafria)",
      orbitalPeriod: "6,1 dias",
      mass: "0,69 massas terrestres",
      funFact: "No sistema TRAPPIST-1 há 7 planetas rochosos tão próximos entre si que, se você estivesse em sua superfície, veria os outros planetas no céu tão grandes quanto a nossa Lua cheia!",
      description: "Entre todos os mundos conhecidos fora do nosso sistema solar, TRAPPIST-1e é um dos que possui maior probabilidade de densidade rochosa similar à da Terra e condições para água líquida estável.",
      tags: ["7 Planetas", "Irmão da Terra", "Alvo do James Webb"]
    },
    {
      id: "wasp-76b",
      name: "WASP-76b",
      subtitle: "O Inferno Onde Chove Ferro Derretido",
      type: "Júpiter Ultrassuperaquecido",
      color: "#e74c3c",
      distance: "640 anos-luz",
      discovered: "2016",
      star: "WASP-76",
      orbitalPeriod: "1,8 dias",
      mass: "0,92 massas de Júpiter",
      funFact: "No lado diurno, o calor de 2.400 °C evapora metais; fortes ventos levam o vapor de ferro para o lado noturno gélido, onde ele se condensa e chove ferro líquido do céu!",
      description: "Um dos mundos mais alienígenas e hostis já registrados pela astrofísica moderna. O planeta está tão preso pelas marés de sua estrela que um dos lados enfrenta calor constante enquanto o outro vive em escuridão perpétua.",
      tags: ["Chuva de Ferro", "Extremo Cósmico", "2400 °C"]
    },
    {
      id: "55-cancri-e",
      name: "55 Cancri e (Janssen)",
      subtitle: "O Planeta de Diamante e Lava",
      type: "Superterra de Carbono",
      color: "#1abc9c",
      distance: "41 anos-luz",
      discovered: "2004",
      star: "Copérnico (55 Cancri A)",
      orbitalPeriod: "18 horas",
      mass: "8,6 massas terrestres",
      funFact: "Estudos sugerem que pelo menos um terço da massa do planeta pode ser composta por diamante puro cristalizado sob pressões e temperaturas descomunais!",
      description: "Com temperaturas de mais de 2.000 °C e oceanos de magma na superfície, o manto deste planeta denso e rico em carbono pode conter uma camada maciça de diamante reluzente.",
      tags: ["Diamante Puro", "Oceano de Lava", "Superterra"]
    },
    {
      id: "hd-189733b",
      name: "HD 189733b",
      subtitle: "Onde Chove Vidro de Lado a 8.700 km/h",
      type: "Júpiter Quente",
      color: "#2980b9",
      distance: "64,5 anos-luz",
      discovered: "2005",
      star: "HD 189733",
      orbitalPeriod: "2,2 dias",
      mass: "1,13 massas de Júpiter",
      funFact: "À primeira vista parece um lindo mundo azul sereno como a Terra, mas sua cor vem de partículas de silicato em suspensão que formam lâminas cortantes de vidro voando a 7 vezes a velocidade do som!",
      description: "Um alerta fascinante de que cores semelhantes à Terra não significam condições calmas. É uma fornalha turbulenta com uma das meteorologias mais mortais da galáxia.",
      tags: ["Chuva de Vidro", "Tempestade Supersônica", "Azul Enganoso"]
    }
  ],

  // 3. ASTRONAUTAS & HEROÍNAS DO ESPAÇO
  astronauts: [
    {
      id: "yuri-gagarin",
      name: "Yuri Gagarin",
      country: "União Soviética",
      achievement: "Primeiro Ser Humano no Espaço (1961)",
      mission: "Vostok 1",
      quote: "A Terra é azul. Que maravilhosa. É incrível!",
      biography: "Em 12 de abril de 1961, o piloto soviético Yuri Gagarin realizou um feito histórico ao orbitar a Terra por 108 minutos a bordo da nave Vostok 1, tornando-se o pioneiro dos voos tripulados.",
      funFact: "Antes do lançamento, Gagarin teve que parar o ônibus a caminho da plataforma de lançamento para urinar na roda traseira. Até hoje, cosmonautas russos mantêm essa tradição como superstição de boa sorte!",
      imageKeyword: "gagarin",
      tags: ["Pioneiro", "Vostok 1", "Primeiro no Espaço"]
    },
    {
      id: "neil-armstrong",
      name: "Neil Armstrong",
      country: "Estados Unidos (NASA)",
      achievement: "Primeiro Homem a Pisar na Lua (1969)",
      mission: "Apollo 11",
      quote: "Este é um pequeno passo para o homem, mas um salto gigantesco para a humanidade.",
      biography: "Comandante da Apollo 11, o engenheiro aeroespacial e piloto de testes Neil Armstrong pousou o módulo lunar Eagle no Mar da Tranquilidade em 20 de julho de 1969 diante de 650 milhões de telespectadores.",
      funFact: "Durante a descida na Lua, o computador quase sobrecarregou e a nave estava indo em direção a uma cratera cheia de rochas gigantes. Armstrong assumiu os controles manuais com frieza e pousou com apenas 25 segundos de combustível restante!",
      imageKeyword: "armstrong",
      tags: ["Lua", "Apollo 11", "Salto Gigantesco"]
    },
    {
      id: "valentina-tereshkova",
      name: "Valentina Tereshkova",
      country: "União Soviética",
      achievement: "Primeira Mulher no Espaço (1963)",
      mission: "Vostok 6",
      quote: "Ei, céu, tire o chapéu! Estou a caminho!",
      biography: "Aos 26 anos, Valentina Tereshkova decolou na Vostok 6 em 16 de junho de 1963, completando 48 órbitas ao redor da Terra em 3 dias — mais tempo no espaço do que todos os astronautas americanos haviam acumulado até então.",
      funFact: "Valentina era uma paraquedista civil amadora e trabalhadora têxtil antes de ser selecionada entre centenas de candidatas devido à sua destreza para ejetar e pousar de paraquedas.",
      imageKeyword: "tereshkova",
      tags: ["Pioneira", "Primeira Mulher", "Vostok 6"]
    },
    {
      id: "marcos-pontes",
      name: "Marcos Pontes",
      country: "Brasil (AEB / NASA / Roscosmos)",
      achievement: "Primeiro Astronauta Lusófono e Brasileiro no Espaço (2006)",
      mission: "Missão Centenário (Soyuz TMA-8 / ISS)",
      quote: "Do espaço não se veem fronteiras entre países, apenas a fragilidade e a beleza unida do nosso planeta.",
      biography: "Engenheiro aeronáutico formado pelo ITA e piloto de caça da FAB, Marcos Pontes decolou no Cosmódromo de Baikonur em 30 de março de 2006 com destino à Estação Espacial Internacional, executando experimentos científicos nacionais em microgravidade.",
      funFact: "A bordo da ISS, ele levou uma semente de Pau-Brasil e uma bandeira nacional, e homenageou o centenário do voo do 14-Bis de Santos Dumont.",
      imageKeyword: "pontes",
      tags: ["Brasil", "Missão Centenário", "ISS"]
    },
    {
      id: "peggy-whitson",
      name: "Peggy Whitson",
      country: "Estados Unidos (NASA / Axiom)",
      achievement: "Maior Tempo Acumulado no Espaço por um Americano (675 dias)",
      mission: "Expedições 5, 16, 50, 51, 52 e Axiom-2",
      quote: "No espaço, você percebe que somos todos tripulantes da mesma espaçonave chamada Terra.",
      biography: "Bioquímica renomada, Whitson foi a primeira mulher a comandar a ISS duas vezes e a primeira mulher a comandar uma missão espacial privada. Ela possui 10 caminhadas espaciais (spacetracks) com mais de 60 horas no vácuo.",
      funFact: "Com 675 dias no espaço, ela quebrou múltiplos recordes mundiais e conduziu centenas de pesquisas pioneiras sobre genética celular em gravidade zero.",
      imageKeyword: "whitson",
      tags: ["Recordista", "Comandante ISS", "Ciência Espacial"]
    },
    {
      id: "chris-hadfield",
      name: "Chris Hadfield",
      country: "Canadá (CSA / NASA)",
      achievement: "Primeiro Canadense a Caminhar no Espaço & Músico Orbital",
      mission: "STS-74, STS-100, Expedição 34/35",
      quote: "O perigo é real, mas o medo é uma escolha que você treina para superar.",
      biography: "Famoso no mundo inteiro por suas transmissões educativas a bordo da ISS e por gravar a versão lendária de 'Space Oddity' de David Bowie em gravidade zero, acumulando mais de 50 milhões de visualizações.",
      funFact: "Durante sua primeira caminhada espacial, uma gota de sabão antiembaçante entrou em seus olhos dentro do capacete lacrado, deixando-o temporariamente cego no vácuo espacial absoluto — mas ele manteve a calma e completou a missão!",
      imageKeyword: "hadfield",
      tags: ["Canadá", "Música no Espaço", "Comandante ISS"]
    }
  ],

  // 4. ASTROS & MISTÉRIOS DO COSMOS
  deepspace: [
    {
      id: "sagittarius-a",
      name: "Sagitário A*",
      subtitle: "O Buraco Negro Supermassivo no Coração da Via Láctea",
      type: "Buraco Negro Supermassivo",
      color: "#9b59b6",
      distance: "26.000 anos-luz da Terra",
      mass: "4,3 milhões de vezes a massa do Sol",
      funFact: "Sua gravidade é tão avassaladora que nem a partícula mais veloz do cosmos — a luz — consegue escapar após ultrapassar o Horizonte de Eventos!",
      description: "No núcleo rotativo da nossa própria galáxia, Sagitário A* atua como a âncora gravitacional da Via Láctea. Sua primeira foto histórica foi capturada pelo telescópio Event Horizon Telescope (EHT) em 2022.",
      tags: ["Buraco Negro", "Centro Galáctico", "Singularidade"]
    },
    {
      id: "pillars-of-creation",
      name: "Pilares da Criação",
      subtitle: "O Berçário Estelar na Nebulosa da Águia (M16)",
      type: "Colunas de Gás e Poeira Interestelar",
      color: "#e67e22",
      distance: "6.500 anos-luz (Constelação da Serpente)",
      mass: "Mais de 200 massas solares de gás",
      funFact: "O pilar mais alto tem cerca de 4 a 5 anos-luz de altura — isso significa que do topo à base cabe toda a distância entre o nosso Sol e a estrela vizinha mais próxima!",
      description: "Estas colunas monumentais de hidrogênio molecular frio e poeira cósmica esculpidas por ventos estelares selvagens estão dando à luz novas estrelas e sistemas planetários embrionários.",
      tags: ["Nebulosa", "Berçário de Estrelas", "James Webb"]
    },
    {
      id: "magnetar",
      name: "Magnetares & Estrelas de Nêutrons",
      subtitle: "Os Ímãs Mais Poderosos do Universo Conhecido",
      type: "Remanescente de Supernova Hiperdenso",
      color: "#00f0ff",
      distance: "Vários (Ex: SGR 1806-20)",
      mass: "1,5 a 2x o Sol comprimido numa esfera de 20 km",
      funFact: "Uma colher de chá do material de uma estrela de nêutrons pesaria cerca de 1 bilhão de toneladas na Terra (equivalente a todo o Monte Everest)! Se um magnetar passasse a 1.000 km, desintegraria os átomos do seu corpo.",
      description: "Quando estrelas gigantes colapsam no fim de suas vidas, seus elétrons e prótons são fundidos em nêutrons puros sob pressão descomunal, gerando campos magnéticos trilhões de vezes mais intensos que o da Terra.",
      tags: ["Densidade Extrema", "Magnetismo Brutal", "Supernova"]
    },
    {
      id: "great-attractor",
      name: "O Grande Atrator",
      subtitle: "A Anomalia Gravitacional Misteriosa",
      type: "Superaglomerado Gravitacional Desconhecido",
      color: "#8e44ad",
      distance: "150 a 250 milhões de anos-luz",
      mass: "Dezenas de milhares de galáxias combinadas",
      funFact: "A Via Láctea e centenas de milhares de outras galáxias estão sendo puxadas a mais de 2 milhões de km/h em direção a esse ponto misterioso, localizado atrás da 'Zona de Evitamento' da nossa galáxia!",
      description: "Uma gigantesca concentração de massa cósmica que puxa todo o Superaglomerado de Laniakea. Por estar oculto atrás do gás denso do centro da nossa galáxia, seus segredos ainda intrigam os astrofísicos.",
      tags: ["Mistério Cósmico", "Laniakea", "Puxão Gravitacional"]
    }
  ],

  // 5. MISSÕES & TELESCÓPIOS
  missions: [
    {
      id: "james-webb",
      name: "Telescópio Espacial James Webb (JWST)",
      agency: "NASA / ESA / CSA",
      launchDate: "25 de Dezembro de 2021",
      location: "Ponto de Lagrange L2 (1,5 milhão de km da Terra)",
      budget: "~10 bilhões de dólares",
      funFact: "Seu espelho de berílio banhado a ouro tem 6,5 metros de diâmetro e é resfriado a incríveis -233 °C com um escudo solar de 5 camadas do tamanho de uma quadra de tênis para enxergar no infravermelho!",
      description: "O mais poderoso telescópio espacial já construído pela humanidade. O Webb consegue 'olhar para trás no tempo', fotografando as primeiras galáxias nascidas logo após o Big Bang e analisando atmosferas de exoplanetas.",
      tags: ["Infravermelho", "Ponto L2", "Origem do Universo"]
    },
    {
      id: "voyager-1",
      name: "Sonda Voyager 1",
      agency: "NASA",
      launchDate: "5 de Setembro de 1977",
      location: "Espaço Interestelar (> 24 bilhões de km da Terra)",
      funFact: "A Voyager 1 é o objeto feito pelo homem mais distante de todos os tempos. Os sinais de rádio levam mais de 22 horas viajando na velocidade da luz para irem e voltarem até ela!",
      description: "Carrega o famoso 'Golden Record' (Disco de Ouro com saudações em 55 línguas humanas, músicas de Beethoven e sons da Terra) e continua comunicando com a Terra enquanto cruza a escuridão silenciosa fora do Sistema Solar.",
      tags: ["Espaço Interestelar", "Disco de Ouro", "Lançada em 1977"]
    },
    {
      id: "iss",
      name: "Estação Espacial Internacional (ISS)",
      agency: "Consórcio Internacional (NASA, Roscosmos, ESA, JAXA, CSA)",
      launchDate: "Novembro de 1998 (Primeiro módulo Zarya)",
      location: "Órbita Terrestre Baixa (~420 km de altitude)",
      funFact: "A ISS orbita a Terra a 27.600 km/h, completando uma volta a cada 90 minutos. Os astronautas a bordo assistem a 16 pores e nasceres do Sol todos os dias!",
      description: "O maior laboratório científico flutuante da história, do tamanho de um campo de futebol americano, continuamente habitado por humanos de várias nacionalidades há mais de duas décadas ininterruptas.",
      tags: ["Laboratório Orbital", "Microgravidade", "16 Amanheceres/Dia"]
    },
    {
      id: "artemis-program",
      name: "Programa Artemis",
      agency: "NASA e parceiros internacionais",
      launchDate: "Em andamento (Artemis I voou com sucesso em 2022)",
      target: "Retorno sustentável à Lua e futura base lunar",
      funFact: "O programa levará à Lua a primeira mulher e a primeira pessoa não-branca da história, estabelecendo a estação orbital Gateway para servir de trampolim rumo a Marte!",
      description: "A nova era de exploração espacial tripulada com o megafoguete SLS e a cápsula Orion, com o objetivo de construir colônias de pesquisa permanente no polo sul da Lua.",
      tags: ["Retorno à Lua", "Foguete SLS", "Rumo a Marte"]
    }
  ],

  // 6. STREAM DE CURIOSIDADES CÓSMICAS (RADAR AO VIVO)
  curiosities: [
    "No espaço não há som: o vácuo não possui moléculas de ar para vibrar ondas sonoras, resultando num silêncio absoluto.",
    "O traje de astronauta da NASA custa aproximadamente 12 milhões de dólares e possui seu próprio sistema de suporte à vida e oxigênio.",
    "Um dia em Vênus é mais longo que um ano em Vênus: o planeta demora 243 dias terrestres para dar uma volta em si mesmo e 225 para orbitar o Sol.",
    "Se você chorar no espaço, as lágrimas não caem pelo seu rosto: elas se acumulam em esferas d'água gelatinosas ao redor dos seus olhos!",
    "Existem mais árvores na Terra (cerca de 3 trilhões) do que estrelas na Via Láctea (cerca de 100 a 400 bilhões).",
    "A pegada de Neil Armstrong na Lua permanecerá intacta por milhões de anos porque não há vento nem chuva para apagá-la.",
    "O Sol perde cerca de 4 milhões de toneladas de massa a cada segundo através da radiação e do vento solar.",
    "Astronautas na Estação Espacial Internacional ficam até 5 cm mais altos devido à descompressão das vértebras da coluna na microgravidade.",
    "Saturno flutuaria na água se existisse um oceano cósmico grande o suficiente para mergulhá-lo.",
    "No exoplaneta HD 189733b chove vidro derretido horizontalmente a mais de 7.000 km/h.",
    "A luz que você vê do Sol agora viajou por 8 minutos e 20 segundos pelo espaço antes de atingir seus olhos.",
    "A maior montanha do Sistema Solar é o Monte Olimpo em Marte: com 22 km de altura, é quase 3 vezes mais alto que o Everest.",
    "A Voyager 1 viaja a mais de 61.000 km/h e já ultrapassou a fronteira de 24 bilhões de quilômetros da Terra.",
    "Existe uma nuvem de poeira gigante no centro da Via Láctea chamada Sagitário B2 que contém bilhões de litros de álcool etílico!",
    "Uma estrela de nêutrons é tão compacta que uma única colher de sopa de seu material pesaria cerca de 1 bilhão de toneladas na Terra.",
    "O espaço interestelar não é completamente vazio: há em média cerca de 1 átomo de hidrogênio a cada centímetro cúbico.",
    "Em Netuno e Urano, as temperaturas e pressões extremas podem fazer com que caia uma chuva literal de diamantes sólidos no interior dos planetas!",
    "A Via Láctea e a galáxia de Andrômeda estão colidindo a 400.000 km/h e vão se fundir completamente em cerca de 4,5 bilhões de anos.",
    "O Telescópio Espacial James Webb consegue detectar o calor corporal de um inseto à distância da Lua!",
    "Astronautas costumam relatar que o cheiro do espaço no traje pós-caminhada espacial lembra bife tostado, metal quente e faíscas de solda.",
    "Existem planetas órfãos ('rogue planets') vagando pela escuridão da galáxia sem nenhuma estrela para orbitar.",
    "A Estação Espacial Internacional viaja tão rápido (27.600 km/h) que cruza a distância de São Paulo a Nova York em apenas 18 minutos.",
    "O pôr do Sol em Marte é azulado devido à maneira como as finas partículas de poeira na atmosfera dispersam a luz avermelhada.",
    "Plutão tem uma geleira gigante de nitrogênio e gelo em formato de coração visível do espaço chamada Tombaugh Regio.",
    "Se você pudesse voar em um avião comercial até o Sol sem parar, a viagem levaria cerca de 19 anos ininterruptos!"
  ],

  // 7. QUIZ CÓSMICO DO ASTROBOT
  quizQuestions: [
    {
      question: "Qual é o planeta mais quente de todo o Sistema Solar?",
      options: [
        "Mercúrio, pois é o mais perto do Sol",
        "Vênus, devido ao efeito estufa descontrolado",
        "Marte, por causa de sua poeira vulcânica",
        "Júpiter, por seu núcleo superaquecido"
      ],
      correctIndex: 1,
      explanation: "Vênus atinge mais de 465 °C em sua superfície graças a uma atmosfera densa de CO2 e ácido sulfúrico que aprisiona todo o calor, superando até Mercúrio!"
    },
    {
      question: "Quem foi a primeira mulher a viajar ao espaço na história?",
      options: [
        "Sally Ride",
        "Peggy Whitson",
        "Valentina Tereshkova",
        "Sunita Williams"
      ],
      correctIndex: 2,
      explanation: "A cosmonauta soviética Valentina Tereshkova decolou na missão Vostok 6 em 16 de junho de 1963, orbitando a Terra 48 vezes!"
    },
    {
      question: "Por que os astronautas ficam mais altos quando passam meses no espaço?",
      options: [
        "Os ossos esticam por causa da radiação solar",
        "A ausência de gravidade permite que a coluna vertebral se descomprima",
        "Eles consomem suplementos que aceleram o crescimento",
        "A pressão arterial empurra os músculos para cima"
      ],
      correctIndex: 1,
      explanation: "Sem a gravidade da Terra comprimindo as vértebras constantemente, os discos da coluna se expandem e o astronauta pode crescer até 5 cm na ISS!"
    },
    {
      question: "Qual é o objeto feito pela humanidade mais distante da Terra atualmente?",
      options: [
        "Telescópio Espacial Hubble",
        "Sonda New Horizons",
        "Rover Curiosity",
        "Sonda Voyager 1"
      ],
      correctIndex: 3,
      explanation: "Lançada em 1977, a Voyager 1 já superou os 24 bilhões de quilômetros da Terra e viaja pelo espaço interestelar profundo!"
    },
    {
      question: "Qual planeta do nosso sistema solar flutuaria na água se houvesse uma banheira grande o suficiente?",
      options: [
        "Saturno",
        "Urano",
        "Mercúrio",
        "Netuno"
      ],
      correctIndex: 0,
      explanation: "Saturno é formado quase inteiramente por hidrogênio e hélio gasosos e possui uma densidade média de 0,687 g/cm³, inferior à densidade da água (1,0 g/cm³)!"
    },
    {
      question: "De que cor é o pôr do Sol quando observado da superfície de Marte?",
      options: [
        "Vermelho vibrante",
        "Verde esmeralda",
        "Azul suave",
        "Amarelo incandescente"
      ],
      correctIndex: 2,
      explanation: "A poeira fina na atmosfera marciana permite que a luz azul penetre com mais eficiência perto do horizonte solar, resultando num crepúsculo azulado inesquecível!"
    }
  ]
};

// Exporta globalmente para uso no browser
window.SPACE_DATA = SPACE_DATA;
