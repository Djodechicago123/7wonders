// scripts/test-engine.js - Tests automatiques du moteur de jeu
const { createGame, processMove, advanceTurn, allPlayersReady } = require('../backend/src/gameEngine');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

console.log('\n🧪 Tests du moteur de jeu 7 Wonders\n');

// ── Test 1: Création d'une partie ─────────────────────────────
console.log('📦 Création de partie');
const players3 = [
  { userId: 'u1', username: 'Alice' },
  { userId: 'u2', username: 'Bob' },
  { userId: 'u3', username: 'Charlie' },
];

test('Créer une partie à 3 joueurs', () => {
  const game = createGame('TEST01', players3);
  assert(game.players.length === 3, 'Devrait avoir 3 joueurs');
  assert(game.age === 1, 'Devrait commencer à l\'âge 1');
  assert(game.turn === 1, 'Devrait commencer au tour 1');
  assert(game.status === 'playing', 'Status devrait être playing');
});

test('Chaque joueur commence avec 3 pièces', () => {
  const game = createGame('TEST02', players3);
  game.players.forEach(p => {
    assert(p.coins === 3, `${p.username} devrait avoir 3 pièces, a ${p.coins}`);
  });
});

test('Chaque joueur a 7 cartes en main', () => {
  const game = createGame('TEST03', players3);
  game.players.forEach(p => {
    assert(p.hand.length === 7, `${p.username} devrait avoir 7 cartes, a ${p.hand.length}`);
  });
});

test('Chaque joueur a une merveille assignée', () => {
  const game = createGame('TEST04', players3);
  game.players.forEach(p => {
    assert(p.wonder, `${p.username} devrait avoir une merveille`);
    assert(p.wonder.name, 'La merveille devrait avoir un nom');
  });
});

test('Merveilles différentes pour chaque joueur', () => {
  const game = createGame('TEST05', players3);
  const wonders = game.players.map(p => p.wonder.name);
  const unique = new Set(wonders);
  assert(unique.size === 3, 'Les 3 joueurs devraient avoir des merveilles différentes');
});

// ── Test 2: Jouer un coup ─────────────────────────────────────
console.log('\n🎮 Jeu d\'un coup');

test('Jouer une carte (vendre)', () => {
  const game = createGame('TEST06', players3);
  const player = game.players[0];
  const card = player.hand[0];
  const cardId = card.uniqueId || card.id;
  const initialCoins = player.coins;

  const result = processMove(game, 'u1', 'sell', cardId);
  assert(result.success, 'processMove devrait réussir');
  assert(player.coins === initialCoins + 3, `Devrait avoir +3 pièces (${player.coins} vs ${initialCoins + 3})`);
  assert(player.hand.length === 6, 'Devrait avoir 6 cartes après avoir joué');
});

test('Ne pas jouer deux fois au même tour', () => {
  const game = createGame('TEST07', players3);
  const player = game.players[0];
  const card1 = player.hand[0];
  const card2 = player.hand[1];

  processMove(game, 'u1', 'sell', card1.uniqueId || card1.id);
  const result = processMove(game, 'u1', 'sell', card2.uniqueId || card2.id);
  assert(result.error, 'Devrait retourner une erreur si déjà joué');
});

test('Vérifier allPlayersReady', () => {
  const game = createGame('TEST08', players3);
  
  assert(!allPlayersReady(game), 'Ne devrait pas être ready au début');
  
  const p1card = game.players[0].hand[0];
  const p2card = game.players[1].hand[0];
  const p3card = game.players[2].hand[0];
  
  processMove(game, 'u1', 'sell', p1card.uniqueId || p1card.id);
  assert(!allPlayersReady(game), 'Pas ready après 1 joueur');
  
  processMove(game, 'u2', 'sell', p2card.uniqueId || p2card.id);
  assert(!allPlayersReady(game), 'Pas ready après 2 joueurs');
  
  processMove(game, 'u3', 'sell', p3card.uniqueId || p3card.id);
  assert(allPlayersReady(game), 'Devrait être ready après tous les joueurs');
});

// ── Test 3: Avancement du tour ─────────────────────────────────
console.log('\n🔄 Avancement des tours');

test('Les mains tournent après le tour', () => {
  const game = createGame('TEST09', players3);
  const hands_before = game.players.map(p => p.hand.map(c => c.uniqueId || c.id));
  
  // Simuler tous les joueurs qui jouent
  game.players.forEach(p => {
    const card = p.hand[0];
    processMove(game, p.userId, 'sell', card.uniqueId || card.id);
  });
  
  advanceTurn(game);
  
  // Les mains devraient avoir changé (rotation)
  const hands_after = game.players.map(p => p.hand.map(c => c.uniqueId || c.id));
  const changed = hands_before.some((h, i) => 
    JSON.stringify(h.sort()) !== JSON.stringify(hands_after[i].sort())
  );
  assert(changed, 'Les mains devraient avoir tourné');
});

// ── Test 4: Cartes ─────────────────────────────────────────────
console.log('\n🃏 Cartes');

const { CARDS, WONDERS } = require('../backend/src/cards.js');

test('Il y a des cartes âge 1', () => {
  assert(CARDS.age1.length >= 20, `Devrait avoir 20+ cartes âge 1 (a ${CARDS.age1.length})`);
});

test('Il y a des cartes âge 2 et 3', () => {
  assert(CARDS.age2.length >= 10, 'Devrait avoir 10+ cartes âge 2');
  assert(CARDS.age3.length >= 10, 'Devrait avoir 10+ cartes âge 3');
});

test('Il y a 7 merveilles', () => {
  assert(WONDERS.length === 7, `Devrait avoir 7 merveilles (a ${WONDERS.length})`);
});

test('Chaque carte a un id, nom et type', () => {
  [...CARDS.age1, ...CARDS.age2, ...CARDS.age3].forEach(c => {
    assert(c.id, `Carte sans id: ${JSON.stringify(c)}`);
    assert(c.name, `Carte sans nom: ${c.id}`);
    assert(c.type, `Carte sans type: ${c.id}`);
  });
});

test('Chaque merveille a des étapes', () => {
  WONDERS.forEach(w => {
    assert(w.stages && w.stages.length >= 2, `Merveille ${w.name} devrait avoir des étapes`);
  });
});

// ── Résumé ─────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`✅ ${passed} tests réussis   ❌ ${failed} tests échoués`);
console.log(`${'─'.repeat(40)}\n`);

if (failed > 0) process.exit(1);
