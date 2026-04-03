// cards.js - Toutes les cartes du jeu
const CARDS = {
  age1: [
    // RESSOURCES (marron)
    { id: 'c1', name: 'Chantier', type: 'resource', age: 1, cost: [], effect: { resources: { wood: 1 } }, color: '#8B4513', minPlayers: 3, copies: 1, icon: '🪵' },
    { id: 'c2', name: 'Exploitation Forestière', type: 'resource', age: 1, cost: [{ coin: 1 }], effect: { resources: { wood: 2 } }, color: '#8B4513', minPlayers: 4, copies: 1, icon: '🌲' },
    { id: 'c3', name: 'Bassin Argileux', type: 'resource', age: 1, cost: [], effect: { resources: { clay: 1 } }, color: '#8B4513', minPlayers: 3, copies: 1, icon: '🧱' },
    { id: 'c4', name: 'Cavité Argileuse', type: 'resource', age: 1, cost: [{ coin: 1 }], effect: { resources: { clay: 2 } }, color: '#8B4513', minPlayers: 4, copies: 1, icon: '⛏️' },
    { id: 'c5', name: 'Filon', type: 'resource', age: 1, cost: [], effect: { resources: { ore: 1 } }, color: '#8B4513', minPlayers: 3, copies: 1, icon: '⚙️' },
    { id: 'c6', name: 'Mine', type: 'resource', age: 1, cost: [{ coin: 1 }], effect: { resources: { ore: 2 } }, color: '#8B4513', minPlayers: 4, copies: 1, icon: '⛰️' },
    { id: 'c7', name: 'Carrière', type: 'resource', age: 1, cost: [], effect: { resources: { stone: 1 } }, color: '#8B4513', minPlayers: 3, copies: 1, icon: '🪨' },

    // RESSOURCES GRISES (manufacturées)
    { id: 'c8', name: 'Moulin', type: 'resource', age: 1, cost: [{ coin: 2 }], effect: { resources: { papyrus: 1 } }, color: '#9B8B6E', minPlayers: 3, copies: 1, icon: '📜' },
    { id: 'c9', name: 'Verrerie', type: 'resource', age: 1, cost: [{ coin: 2 }], effect: { resources: { glass: 1 } }, color: '#9B8B6E', minPlayers: 3, copies: 1, icon: '🔮' },
    { id: 'c10', name: 'Presse', type: 'resource', age: 1, cost: [{ coin: 2 }], effect: { resources: { textile: 1 } }, color: '#9B8B6E', minPlayers: 3, copies: 1, icon: '🧵' },

    // CIVIL (bleu)
    { id: 'c11', name: 'Autel', type: 'civil', age: 1, cost: [], effect: { vp: 2 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '⛩️' },
    { id: 'c12', name: 'Théâtre', type: 'civil', age: 1, cost: [], effect: { vp: 2 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '🎭' },
    { id: 'c13', name: 'Bains', type: 'civil', age: 1, cost: [{ stone: 1 }], effect: { vp: 3 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '🛁' },

    // COMMERCE (jaune)
    { id: 'c14', name: 'Taverne', type: 'commerce', age: 1, cost: [], effect: { coins: 5 }, color: '#F9A825', minPlayers: 4, copies: 1, icon: '🍺' },
    { id: 'c15', name: 'Comptoir Ouest', type: 'commerce', age: 1, cost: [], effect: { tradeLeft: ['clay', 'ore', 'wood', 'stone'] }, color: '#F9A825', minPlayers: 3, copies: 1, icon: '🤝' },
    { id: 'c16', name: 'Comptoir Est', type: 'commerce', age: 1, cost: [], effect: { tradeRight: ['clay', 'ore', 'wood', 'stone'] }, color: '#F9A825', minPlayers: 3, copies: 1, icon: '🤝' },
    { id: 'c17', name: 'Marché', type: 'commerce', age: 1, cost: [], effect: { tradeLeft: ['papyrus', 'glass', 'textile'], tradeRight: ['papyrus', 'glass', 'textile'] }, color: '#F9A825', minPlayers: 3, copies: 1, icon: '🏪' },

    // MILITAIRE (rouge)
    { id: 'c18', name: 'Palissade', type: 'military', age: 1, cost: [{ wood: 1 }], effect: { shields: 1 }, color: '#C62828', minPlayers: 3, copies: 1, icon: '⚔️' },
    { id: 'c19', name: 'Caserne', type: 'military', age: 1, cost: [{ ore: 1 }], effect: { shields: 1 }, color: '#C62828', minPlayers: 3, copies: 1, icon: '🏰' },
    { id: 'c20', name: 'Ecurie', type: 'military', age: 1, cost: [{ clay: 1 }], effect: { shields: 1 }, color: '#C62828', minPlayers: 4, copies: 1, icon: '🐎' },

    // SCIENCE (vert)
    { id: 'c21', name: 'Officine', type: 'science', age: 1, cost: [{ textile: 1 }], effect: { science: 'compass' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '🧪' },
    { id: 'c22', name: 'Scriptorium', type: 'science', age: 1, cost: [{ papyrus: 1 }], effect: { science: 'tablet' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '📚' },
    { id: 'c23', name: 'Atelier', type: 'science', age: 1, cost: [{ glass: 1 }], effect: { science: 'gear' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '🔭' },
  ],

  age2: [
    // RESSOURCES
    { id: 'c24', name: 'Scierie', type: 'resource', age: 2, cost: [{ coin: 2 }], effect: { resources: { wood: 2 } }, color: '#8B4513', minPlayers: 3, copies: 1, icon: '🪵' },
    { id: 'c25', name: 'Briqueterie', type: 'resource', age: 2, cost: [{ coin: 2 }], effect: { resources: { clay: 2 } }, color: '#8B4513', minPlayers: 3, copies: 1, icon: '🧱' },
    { id: 'c26', name: 'Fonderie', type: 'resource', age: 2, cost: [{ coin: 2 }], effect: { resources: { ore: 2 } }, color: '#8B4513', minPlayers: 3, copies: 1, icon: '⚙️' },
    { id: 'c27', name: 'Carrière', type: 'resource', age: 2, cost: [{ coin: 2 }], effect: { resources: { stone: 2 } }, color: '#8B4513', minPlayers: 3, copies: 1, icon: '🪨' },

    // CIVIL
    { id: 'c28', name: 'Aqueduc', type: 'civil', age: 2, cost: [{ stone: 3 }], effect: { vp: 5 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '🏛️' },
    { id: 'c29', name: 'Temple', type: 'civil', age: 2, cost: [{ wood: 1, clay: 1, glass: 1 }], effect: { vp: 3 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '⛪' },
    { id: 'c30', name: 'Statue', type: 'civil', age: 2, cost: [{ ore: 2, wood: 1 }], effect: { vp: 4 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '🗿' },
    { id: 'c31', name: 'Tribunal', type: 'civil', age: 2, cost: [{ wood: 2, textile: 1 }], effect: { vp: 4 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '⚖️' },

    // MILITAIRE
    { id: 'c32', name: 'Muraille', type: 'military', age: 2, cost: [{ stone: 3 }], effect: { shields: 2 }, color: '#C62828', minPlayers: 3, copies: 1, icon: '🏯' },
    { id: 'c33', name: 'Champs de Tir', type: 'military', age: 2, cost: [{ ore: 2, wood: 1 }], effect: { shields: 2 }, color: '#C62828', minPlayers: 3, copies: 1, icon: '🏹' },
    { id: 'c34', name: 'Ecurie', type: 'military', age: 2, cost: [{ clay: 2, wood: 1, ore: 1 }], effect: { shields: 2 }, color: '#C62828', minPlayers: 3, copies: 1, icon: '⚔️' },

    // SCIENCE
    { id: 'c35', name: 'Dispensaire', type: 'science', age: 2, cost: [{ ore: 2, glass: 1 }], effect: { science: 'compass' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '⚗️' },
    { id: 'c36', name: 'Bibliothèque', type: 'science', age: 2, cost: [{ stone: 2, textile: 1 }], effect: { science: 'tablet' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '📖' },
    { id: 'c37', name: 'Laboratoire', type: 'science', age: 2, cost: [{ clay: 2, papyrus: 1 }], effect: { science: 'gear' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '🔬' },
    { id: 'c38', name: 'Ecole', type: 'science', age: 2, cost: [{ wood: 1, papyrus: 1 }], effect: { science: 'tablet' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '🏫' },

    // COMMERCE
    { id: 'c39', name: 'Forum', type: 'commerce', age: 2, cost: [{ clay: 2 }], effect: { tradeLeft: ['papyrus', 'glass', 'textile'], tradeRight: ['papyrus', 'glass', 'textile'] }, color: '#F9A825', minPlayers: 3, copies: 1, icon: '🏟️' },
    { id: 'c40', name: 'Caravansérail', type: 'commerce', age: 2, cost: [{ wood: 2 }], effect: { tradeLeft: ['clay', 'ore', 'wood', 'stone'], tradeRight: ['clay', 'ore', 'wood', 'stone'] }, color: '#F9A825', minPlayers: 3, copies: 1, icon: '🐪' },
    { id: 'c41', name: 'Vignoble', type: 'commerce', age: 2, cost: [], effect: { coinsPerType: 'resource', amount: 1 }, color: '#F9A825', minPlayers: 3, copies: 1, icon: '🍇' },
  ],

  age3: [
    // CIVIL
    { id: 'c42', name: 'Panthéon', type: 'civil', age: 3, cost: [{ clay: 2, ore: 1, glass: 1, papyrus: 1, textile: 1 }], effect: { vp: 7 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '🏛️' },
    { id: 'c43', name: 'Jardins', type: 'civil', age: 3, cost: [{ clay: 2, wood: 2 }], effect: { vp: 5 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '🌿' },
    { id: 'c44', name: 'Hôtel de Ville', type: 'civil', age: 3, cost: [{ stone: 2, ore: 2, clay: 3 }], effect: { vp: 6 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '🏛️' },
    { id: 'c45', name: 'Palais', type: 'civil', age: 3, cost: [{ stone: 1, ore: 1, wood: 1, clay: 1, glass: 1, papyrus: 1, textile: 1 }], effect: { vp: 8 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '👑' },
    { id: 'c46', name: 'Sénat', type: 'civil', age: 3, cost: [{ wood: 2, stone: 1, ore: 1 }], effect: { vp: 6 }, color: '#1565C0', minPlayers: 3, copies: 1, icon: '🏛️' },

    // MILITAIRE
    { id: 'c47', name: 'Fortifications', type: 'military', age: 3, cost: [{ ore: 3, stone: 1 }], effect: { shields: 3 }, color: '#C62828', minPlayers: 3, copies: 1, icon: '🏰' },
    { id: 'c48', name: 'Arsenal', type: 'military', age: 3, cost: [{ ore: 1, wood: 2, textile: 1 }], effect: { shields: 3 }, color: '#C62828', minPlayers: 3, copies: 1, icon: '⚔️' },
    { id: 'c49', name: 'Castrum', type: 'military', age: 3, cost: [{ clay: 3, textile: 1 }], effect: { shields: 3 }, color: '#C62828', minPlayers: 3, copies: 1, icon: '🗡️' },

    // SCIENCE
    { id: 'c50', name: 'Loge', type: 'science', age: 3, cost: [{ ore: 2, papyrus: 1, textile: 1 }], effect: { science: 'compass' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '🔭' },
    { id: 'c51', name: 'Académie', type: 'science', age: 3, cost: [{ stone: 3, glass: 1 }], effect: { science: 'compass' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '🎓' },
    { id: 'c52', name: 'Observatoire', type: 'science', age: 3, cost: [{ ore: 2, glass: 1, textile: 1 }], effect: { science: 'gear' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '🌠' },
    { id: 'c53', name: 'Etude', type: 'science', age: 3, cost: [{ wood: 1, glass: 1, papyrus: 1, textile: 1 }], effect: { science: 'gear' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '📓' },
    { id: 'c54', name: 'Université', type: 'science', age: 3, cost: [{ wood: 2, papyrus: 1, glass: 1 }], effect: { science: 'tablet' }, color: '#2E7D32', minPlayers: 3, copies: 1, icon: '🏫' },

    // COMMERCE
    { id: 'c55', name: 'Arène', type: 'commerce', age: 3, cost: [{ stone: 2, ore: 1 }], effect: { coinsPerWonderStage: 3, vpPerWonderStage: 1 }, color: '#F9A825', minPlayers: 3, copies: 1, icon: '🏟️' },
    { id: 'c56', name: 'Chambre de Commerce', type: 'commerce', age: 3, cost: [{ clay: 2, papyrus: 1 }], effect: { coinsPerGray: 2, vpPerGray: 1 }, color: '#F9A825', minPlayers: 4, copies: 1, icon: '💼' },
    { id: 'c57', name: 'Port', type: 'commerce', age: 3, cost: [{ wood: 1, ore: 1, textile: 1 }], effect: { coinsPerResource: 1, vpPerResource: 1 }, color: '#F9A825', minPlayers: 4, copies: 1, icon: '⚓' },
    { id: 'c58', name: 'Phare', type: 'commerce', age: 3, cost: [{ stone: 2, glass: 1 }], effect: { coinsPerCommerce: 1, vpPerCommerce: 1 }, color: '#F9A825', minPlayers: 4, copies: 1, icon: '🗼' },

    // GUILDES (violet) - partagées entre joueurs
    { id: 'g1', name: 'Guilde des Travailleurs', type: 'guild', age: 3, cost: [{ ore: 2, clay: 1, stone: 1, wood: 1 }], effect: { vpPerNeighborResource: 1 }, color: '#6A1B9A', minPlayers: 3, copies: 1, icon: '⛏️' },
    { id: 'g2', name: 'Guilde des Artisans', type: 'guild', age: 3, cost: [{ ore: 2, stone: 2 }], effect: { vpPerNeighborManufactured: 2 }, color: '#6A1B9A', minPlayers: 3, copies: 1, icon: '🔨' },
    { id: 'g3', name: 'Guilde des Magistrats', type: 'guild', age: 3, cost: [{ wood: 3, stone: 1, textile: 1 }], effect: { vpPerNeighborCivil: 1 }, color: '#6A1B9A', minPlayers: 3, copies: 1, icon: '⚖️' },
    { id: 'g4', name: 'Guilde des Marchands', type: 'guild', age: 3, cost: [{ clay: 1, wood: 1, glass: 1, papyrus: 1, textile: 1 }], effect: { coinsAndVpPerNeighborCommerce: 1 }, color: '#6A1B9A', minPlayers: 3, copies: 1, icon: '💰' },
    { id: 'g5', name: 'Guilde des Espions', type: 'guild', age: 3, cost: [{ clay: 3, glass: 1 }], effect: { vpPerNeighborMilitary: 1 }, color: '#6A1B9A', minPlayers: 3, copies: 1, icon: '🗡️' },
    { id: 'g6', name: 'Guilde des Philosophes', type: 'guild', age: 3, cost: [{ clay: 3, papyrus: 1, textile: 1 }], effect: { vpPerNeighborScience: 1 }, color: '#6A1B9A', minPlayers: 3, copies: 1, icon: '📜' },
    { id: 'g7', name: 'Guilde des Bâtisseurs', type: 'guild', age: 3, cost: [{ stone: 2, clay: 2, glass: 1 }], effect: { vpPerWonderStageBuilt: 1, coinPerWonderStage: 1 }, color: '#6A1B9A', minPlayers: 3, copies: 1, icon: '🏗️' },
  ]
};

const WONDERS = [
  {
    id: 'w-gizeh',
    name: 'Gizeh',
    boardFile: 'wonder-board-gizeh',
    subtitle: 'Les Pyramides',
    region: 'Égypte',
    startResource: { stone: 1 },
    accentColor: '#D4AC0D',
    stages: [
      { cost: { stone: 2 }, effect: { vp: 3 } },
      { cost: { wood: 3 }, effect: { vp: 5 } },
      { cost: { stone: 4 }, effect: { vp: 7 } },
    ],
    icon: '🔺',
  },
  {
    id: 'w-rhodes',
    name: 'Rhodes',
    boardFile: 'wonder-board-rhodes',
    subtitle: 'Le Colosse',
    region: 'Grèce',
    startResource: { ore: 1 },
    accentColor: '#EF5350',
    stages: [
      { cost: { wood: 2 }, effect: { shields: 1 } },
      { cost: { clay: 3 }, effect: { vp: 3, coins: 3 } },
      { cost: { ore: 4 }, effect: { shields: 1 } },
    ],
    icon: '🗿',
  },
  {
    id: 'w-alexandrie',
    name: 'Alexandrie',
    boardFile: 'wonder-board-alexandrie',
    subtitle: 'Le Phare',
    region: 'Égypte',
    startResource: { glass: 1 },
    accentColor: '#42A5F5',
    stages: [
      { cost: { stone: 2 }, effect: { vp: 3 } },
      { cost: { ore: 2 }, effect: { resources: { any: 1 } } },
      { cost: { glass: 2 }, effect: { vp: 7 } },
    ],
    icon: '💡',
  },
  {
    id: 'w-babylone',
    name: 'Babylone',
    boardFile: 'wonder-board-babylone',
    subtitle: 'Les Jardins Suspendus',
    region: 'Mésopotamie',
    startResource: { clay: 1 },
    accentColor: '#FF7043',
    stages: [
      { cost: { clay: 2 }, effect: { vp: 3 } },
      { cost: { wood: 3 }, effect: { science: 'any' } },
      { cost: { clay: 4 }, effect: { science: 'any' } },
    ],
    icon: '🌿',
  },
  {
    id: 'w-olympie',
    name: 'Olympie',
    boardFile: 'wonder-board-olympie',
    subtitle: 'La Statue de Zeus',
    region: 'Grèce',
    startResource: { wood: 1 },
    accentColor: '#66BB6A',
    stages: [
      { cost: { wood: 2 }, effect: { vp: 3 } },
      { cost: { stone: 2 }, effect: { freeBuild: true } },
      { cost: { ore: 2 }, effect: { vp: 7 } },
    ],
    icon: '🔥',
  },
  {
    id: 'w-halicarnasse',
    name: 'Halicarnasse',
    boardFile: 'wonder-board-halicarnasse',
    subtitle: 'Le Mausolée',
    region: 'Anatolie',
    startResource: { textile: 1 },
    accentColor: '#CE93D8',
    stages: [
      { cost: { clay: 2 }, effect: { vp: 3 } },
      { cost: { ore: 3 }, effect: { discardBuild: true } },
      { cost: { textile: 2 }, effect: { discardBuild: true, vp: 2 } },
    ],
    icon: '🏺',
  },
  {
    id: 'w-ephese',
    name: 'Éphèse',
    boardFile: 'wonder-board-ephese',
    subtitle: "Le Temple d'Artémis",
    region: 'Ionie',
    startResource: { papyrus: 1 },
    accentColor: '#FFA726',
    stages: [
      { cost: { stone: 2 }, effect: { vp: 3 } },
      { cost: { wood: 2 }, effect: { coins: 9 } },
      { cost: { papyrus: 2 }, effect: { vp: 7 } },
    ],
    icon: '🏛️',
  },
];

module.exports = { CARDS, WONDERS };
