// gameEngine.js - Moteur de jeu 7 Wonders
const { CARDS, WONDERS } = require('./cards');

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createDeck(age, playerCount) {
  const allCards = CARDS[`age${age}`];
  // Filtrer selon le nombre de joueurs, avec fallback sur toutes les cartes
  const filtered = allCards.filter(c => c.minPlayers <= playerCount);
  const eligible = filtered.length > 0 ? filtered : allCards;
  // Créer 7 cartes par joueur (nombre standard)
  const deck = [];
  const cardsPerPlayer = 7;
  const needed = cardsPerPlayer * playerCount;

  // Ajouter les guildes en âge 3
  if (age === 3) {
    const guilds = allCards.filter(c => c.type === 'guild');
    const shuffledGuilds = shuffle(guilds);
    const selectedGuilds = shuffledGuilds.slice(0, playerCount + 2);
    const nonGuilds = eligible.filter(c => c.type !== 'guild');
    const remaining = needed - selectedGuilds.length;
    const shuffledNonGuilds = shuffle(nonGuilds);
    deck.push(...selectedGuilds, ...shuffledNonGuilds.slice(0, remaining));
    return shuffle(deck);
  }

  const shuffled = shuffle(eligible);
  // Répéter si pas assez de cartes
  while (deck.length < needed) {
    deck.push(...shuffled.map((c, i) => ({ ...c, uniqueId: `${c.id}_${deck.length + i}` })));
  }
  return shuffle(deck.slice(0, needed));
}

function distributeHands(deck, playerCount) {
  const hands = [];
  const cardsPerPlayer = Math.floor(deck.length / playerCount);
  for (let i = 0; i < playerCount; i++) {
    hands.push(deck.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer));
  }
  return hands;
}

function createInitialPlayer(userId, username, wonderIndex, playerIndex, wonderId) {
  const wonder = (wonderId && WONDERS.find(w => w.id === wonderId))
    || WONDERS[wonderIndex % WONDERS.length];
  return {
    userId,
    username,
    wonder,
    wonderStagesBuilt: 0,
    resources: { ...wonder.startResource },
    coins: 3,
    shields: 0,
    science: { compass: 0, tablet: 0, gear: 0 },
    builtCards: [],
    hand: [],
    selectedAction: null,
    selectedCard: null,
    ready: false,
    vp: 0,
    tradeLeft: { clay: 2, ore: 2, wood: 2, stone: 2, papyrus: 2, glass: 2, textile: 2 },
    tradeRight: { clay: 2, ore: 2, wood: 2, stone: 2, papyrus: 2, glass: 2, textile: 2 },
  };
}

function createGame(gameId, players) {
  const playerCount = players.length;
  const wonderOrder = shuffle([...Array(WONDERS.length).keys()]);

  const gamePlayers = players.map((p, i) =>
    createInitialPlayer(p.userId, p.username, wonderOrder[i], i, p.wonderId)
  );

  const deck1 = createDeck(1, playerCount);
  const hands = distributeHands(deck1, playerCount);
  gamePlayers.forEach((p, i) => { p.hand = hands[i]; });

  return {
    id: gameId,
    status: 'playing',
    age: 1,
    turn: 1,
    direction: 1, // 1 = droite, -1 = gauche
    players: gamePlayers,
    discardPile: [],
    pendingMoves: {},
    decks: {
      age2: createDeck(2, playerCount),
      age3: createDeck(3, playerCount),
    },
    militaryResults: [],
    log: [],
  };
}

function canAfford(player, cost, leftNeighbor, rightNeighbor, game) {
  if (!cost || cost.length === 0) return { canAfford: true, coinCost: 0 };

  const needed = {};
  (Array.isArray(cost) ? cost : [cost]).forEach(c => {
    Object.entries(c).forEach(([res, amt]) => {
      if (res !== 'coin') needed[res] = (needed[res] || 0) + amt;
    });
  });

  // Coins directs requis
  const coinRequired = (Array.isArray(cost) ? cost : [cost]).reduce((sum, c) => sum + (c.coin || 0), 0);

  const available = { ...player.resources };

  // Calculer ce qu'il manque
  let extraCost = 0;
  const missing = {};
  Object.entries(needed).forEach(([res, amt]) => {
    const have = available[res] || 0;
    if (have < amt) missing[res] = amt - have;
  });

  // Calculer le coût de commerce
  for (const [res, amt] of Object.entries(missing)) {
    const leftCost = player.tradeLeft[res] || 2;
    const rightCost = player.tradeRight[res] || 2;
    const cheapest = Math.min(leftCost, rightCost);
    extraCost += cheapest * amt;
  }

  const totalCoinCost = coinRequired + extraCost;
  return {
    canAfford: player.coins >= totalCoinCost,
    coinCost: totalCoinCost,
    missing,
  };
}

function applyCardEffect(player, card, game, players) {
  const effect = card.effect;
  if (!effect) return;

  if (effect.resources) {
    Object.entries(effect.resources).forEach(([res, amt]) => {
      if (res !== 'any') player.resources[res] = (player.resources[res] || 0) + amt;
    });
  }
  if (effect.coins) player.coins += effect.coins;
  if (effect.vp) player.vp += effect.vp;
  if (effect.shields) player.shields += effect.shields;
  if (effect.science) {
    if (effect.science !== 'any') {
      player.science[effect.science] = (player.science[effect.science] || 0) + 1;
    }
  }
  if (effect.tradeLeft) {
    effect.tradeLeft.forEach(res => { player.tradeLeft[res] = 1; });
  }
  if (effect.tradeRight) {
    effect.tradeRight.forEach(res => { player.tradeRight[res] = 1; });
  }
}

function processMove(game, userId, action, cardId) {
  const playerIndex = game.players.findIndex(p => p.userId === userId);
  if (playerIndex === -1) return { error: 'Joueur introuvable' };
  if (game.pendingMoves[userId]) return { error: 'Tu as déjà joué ce tour' };

  const player = game.players[playerIndex];
  const card = player.hand.find(c => (c.uniqueId || c.id) === cardId);
  if (!card) return { error: 'Carte introuvable dans la main' };

  const leftNeighbor = game.players[(playerIndex - 1 + game.players.length) % game.players.length];
  const rightNeighbor = game.players[(playerIndex + 1) % game.players.length];

  // Valider et calculer le coût AVANT de modifier l'état
  let tradingCost = 0;
  if (action === 'play') {
    const cost = card.cost || [];
    if (cost.length > 0) {
      const result = canAfford(player, cost, leftNeighbor, rightNeighbor, game);
      if (!result.canAfford) return { error: `Ressources insuffisantes pour construire ${card.name}` };
      tradingCost = result.coinCost;
    }
  } else if (action === 'wonder') {
    if (player.wonderStagesBuilt >= player.wonder.stages.length) return { error: 'Merveille déjà complète' };
    const stage = player.wonder.stages[player.wonderStagesBuilt];
    const stageCost = stage.cost ? [stage.cost] : [];
    if (stageCost.length > 0) {
      const result = canAfford(player, stageCost, leftNeighbor, rightNeighbor, game);
      if (!result.canAfford) return { error: `Ressources insuffisantes pour l'étape ${player.wonderStagesBuilt + 1}` };
      tradingCost = result.coinCost;
    }
  }

  // Appliquer les changements d'état
  game.pendingMoves[userId] = { action, cardId, playerIndex };
  player.hand = player.hand.filter(c => (c.uniqueId || c.id) !== cardId);
  if (tradingCost > 0) player.coins -= tradingCost;

  if (action === 'play') {
    player.builtCards.push(card);
    applyCardEffect(player, card, game, game.players);
    game.log.push(`${player.username} construit ${card.name}`);
  } else if (action === 'sell') {
    player.coins += 3;
    game.discardPile.push(card);
    game.log.push(`${player.username} vend ${card.name} pour 3 pièces`);
  } else if (action === 'wonder') {
    const stage = player.wonder.stages[player.wonderStagesBuilt];
    player.wonderStagesBuilt++;
    game.discardPile.push(card);
    if (stage.effect) {
      applyCardEffect(player, { effect: stage.effect }, game, game.players);
    }
    game.log.push(`${player.username} construit l'étape ${player.wonderStagesBuilt} de ${player.wonder.name}`);
  }

  return { success: true };
}

function rotatehands(game) {
  const players = game.players;
  const n = players.length;
  const hands = players.map(p => p.hand);

  if (game.age === 2) {
    // Âge 2: rotation vers la gauche
    const newHands = hands.map((_, i) => hands[(i + 1) % n]);
    players.forEach((p, i) => { p.hand = newHands[i]; });
  } else {
    // Âge 1 et 3: rotation vers la droite
    const newHands = hands.map((_, i) => hands[(i - 1 + n) % n]);
    players.forEach((p, i) => { p.hand = newHands[i]; });
  }
}

function resolveMilitary(game) {
  const results = [];
  const n = game.players.length;
  const victoryCoin = game.age === 1 ? 1 : game.age === 2 ? 3 : 5;
  const defeatPenalty = -1;

  game.players.forEach((player, i) => {
    const left = game.players[(i - 1 + n) % n];
    const right = game.players[(i + 1) % n];
    let tokens = 0;

    // Vs gauche
    if (player.shields > left.shields) tokens += victoryCoin;
    else if (player.shields < left.shields) tokens += defeatPenalty;

    // Vs droite
    if (player.shields > right.shields) tokens += victoryCoin;
    else if (player.shields < right.shields) tokens += defeatPenalty;

    player.vp += tokens;
    results.push({ player: player.username, tokens });
  });

  return results;
}

function advanceAge(game) {
  resolveMilitary(game);
  game.age++;
  game.turn = 1;
  game.pendingMoves = {};

  if (game.age > 3) {
    game.status = 'finished';
    calculateFinalScores(game);
    return;
  }

  const deckKey = `age${game.age}`;
  const deck = game.decks[deckKey] || createDeck(game.age, game.players.length);
  const hands = distributeHands(deck, game.players.length);
  game.players.forEach((p, i) => { p.hand = hands[i]; });
}

function calculateScienceScore(science) {
  const { compass = 0, tablet = 0, gear = 0 } = science;
  const sets = Math.min(compass, tablet, gear);
  return sets * 7 + compass * compass + tablet * tablet + gear * gear;
}

function calculateCommerceVP(player) {
  let commerceVP = 0;
  let commerceCoins = 0;
  const isGray = c => c.type === 'resource' && c.effect && c.effect.resources &&
    Object.keys(c.effect.resources).some(r => ['papyrus', 'glass', 'textile'].includes(r));
  const isBrown = c => c.type === 'resource' && c.effect && c.effect.resources &&
    Object.keys(c.effect.resources).some(r => ['wood', 'clay', 'ore', 'stone'].includes(r));

  player.builtCards.filter(c => c.type === 'commerce').forEach(card => {
    const e = card.effect;
    if (!e) return;
    if (e.coinsPerWonderStage || e.vpPerWonderStage) {
      const stages = player.wonderStagesBuilt;
      if (e.coinsPerWonderStage) commerceCoins += stages * e.coinsPerWonderStage;
      if (e.vpPerWonderStage) commerceVP += stages * e.vpPerWonderStage;
    }
    if (e.coinsPerGray || e.vpPerGray) {
      const count = player.builtCards.filter(isGray).length;
      if (e.coinsPerGray) commerceCoins += count * e.coinsPerGray;
      if (e.vpPerGray) commerceVP += count * e.vpPerGray;
    }
    if (e.coinsPerResource || e.vpPerResource) {
      const count = player.builtCards.filter(isBrown).length;
      if (e.coinsPerResource) commerceCoins += count * e.coinsPerResource;
      if (e.vpPerResource) commerceVP += count * e.vpPerResource;
    }
    if (e.coinsPerCommerce || e.vpPerCommerce) {
      const count = player.builtCards.filter(c => c.type === 'commerce').length;
      if (e.coinsPerCommerce) commerceCoins += count * e.coinsPerCommerce;
      if (e.vpPerCommerce) commerceVP += count * e.vpPerCommerce;
    }
  });
  player.coins += commerceCoins;
  return commerceVP;
}

function calculateGuildVP(player, leftNeighbor, rightNeighbor) {
  let guildVP = 0;
  const countCards = (p, types) => p.builtCards.filter(c => types.includes(c.type)).length;
  const isGray = c => c.type === 'resource' && c.effect && c.effect.resources &&
    Object.keys(c.effect.resources).some(r => ['papyrus', 'glass', 'textile'].includes(r));

  player.builtCards.filter(c => c.type === 'guild').forEach(card => {
    const e = card.effect;
    if (!e) return;
    if (e.vpPerNeighborResource) {
      const count = countCards(leftNeighbor, ['resource']) + countCards(rightNeighbor, ['resource']);
      guildVP += count * e.vpPerNeighborResource;
    }
    if (e.vpPerNeighborManufactured) {
      const count = leftNeighbor.builtCards.filter(isGray).length + rightNeighbor.builtCards.filter(isGray).length;
      guildVP += count * e.vpPerNeighborManufactured;
    }
    if (e.vpPerNeighborCivil) {
      const count = countCards(leftNeighbor, ['civil']) + countCards(rightNeighbor, ['civil']);
      guildVP += count * e.vpPerNeighborCivil;
    }
    if (e.coinsAndVpPerNeighborCommerce) {
      const count = countCards(leftNeighbor, ['commerce']) + countCards(rightNeighbor, ['commerce']);
      guildVP += count * e.coinsAndVpPerNeighborCommerce;
      player.coins += count * e.coinsAndVpPerNeighborCommerce;
    }
    if (e.vpPerNeighborMilitary) {
      const count = countCards(leftNeighbor, ['military']) + countCards(rightNeighbor, ['military']);
      guildVP += count * e.vpPerNeighborMilitary;
    }
    if (e.vpPerNeighborScience) {
      const count = countCards(leftNeighbor, ['science']) + countCards(rightNeighbor, ['science']);
      guildVP += count * e.vpPerNeighborScience;
    }
    if (e.vpPerWonderStageBuilt) {
      const count = leftNeighbor.wonderStagesBuilt + rightNeighbor.wonderStagesBuilt;
      guildVP += count * e.vpPerWonderStageBuilt;
      if (e.coinPerWonderStage) player.coins += count * e.coinPerWonderStage;
    }
  });
  return guildVP;
}

function calculateFinalScores(game) {
  const n = game.players.length;
  game.players.forEach((player, i) => {
    const leftNeighbor = game.players[(i - 1 + n) % n];
    const rightNeighbor = game.players[(i + 1) % n];

    const civilVP = player.builtCards.filter(c => c.type === 'civil')
      .reduce((s, c) => s + (c.effect && c.effect.vp ? c.effect.vp : 0), 0);
    const wonderVP = player.wonder.stages.slice(0, player.wonderStagesBuilt)
      .reduce((s, stage) => s + (stage.effect && stage.effect.vp ? stage.effect.vp : 0), 0);
    const militaryVP = player.vp - civilVP - wonderVP;

    const commerceVP = calculateCommerceVP(player);
    const guildVP = calculateGuildVP(player, leftNeighbor, rightNeighbor);
    const scienceVP = calculateScienceScore(player.science);
    const coinVP = player.coins / 3 | 0;

    player.vp += commerceVP + guildVP;
    player.finalScore = player.vp + scienceVP + coinVP;
    player.scoreBreakdown = {
      military: militaryVP,
      civil: civilVP,
      wonder: wonderVP,
      science: scienceVP,
      commerce: commerceVP,
      guild: guildVP,
      coins: coinVP,
      total: player.finalScore,
    };
  });
  game.players.sort((a, b) => b.finalScore - a.finalScore);
}

function advanceTurn(game) {
  game.turn++;
  game.pendingMoves = {};

  if (game.players[0].hand.length <= 1) {
    // Fin de l'âge: la dernière carte est défaussée
    game.players.forEach(p => { game.discardPile.push(...p.hand); p.hand = []; });
    advanceAge(game);
    return;
  }

  rotatehands(game);
}

function allPlayersReady(game) {
  return Object.keys(game.pendingMoves).length === game.players.length;
}

module.exports = {
  createGame,
  processMove,
  advanceTurn,
  allPlayersReady,
  canAfford,
  calculateFinalScores,
  calculateScienceScore,
};
