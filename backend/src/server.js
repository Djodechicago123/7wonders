// server.js - Serveur principal 7 Wonders
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { createGame, processMove, advanceTurn, allPlayersReady } = require('./gameEngine');
const { register, login, requireAuth, getProfile, verifyToken } = require('./auth');
const { getLeaderboard, getUserHistory, saveGameResult, updateUserStats } = require('./supabase');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ── Stockage en mémoire ──────────────────────────────────────
const lobbies = {};

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ── AUTH ROUTES ──────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await register(username, email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const profile = await getProfile(req.auth.userId);
    res.json(profile);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ── CLASSEMENT & HISTORIQUE ──────────────────────────────────
app.get('/api/leaderboard', async (req, res) => {
  const data = await getLeaderboard();
  res.json(data);
});

app.get('/api/users/:userId/history', requireAuth, async (req, res) => {
  const data = await getUserHistory(req.params.userId);
  res.json(data);
});

// ── REST LOBBY ───────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ ok: true, timestamp: Date.now() }));

app.get('/api/cards', (req, res) => {
  const { CARDS, WONDERS } = require('./cards');
  res.json({ cards: CARDS, wonders: WONDERS });
});

app.post('/api/lobby/create', (req, res) => {
  const { wonderId, wonderName, username, token } = req.body;
  if (!wonderId) return res.status(400).json({ error: 'Merveille requise' });

  const code = generateCode();
  const userId = uuidv4();
  const displayName = username || wonderName;
  const authPayload = token ? verifyToken(token) : null;
  const dbUserId = authPayload?.userId || null;

  lobbies[code] = {
    code,
    hostId: userId,
    status: 'waiting',
    players: [{ userId, username: displayName, wonderId, ready: false, dbUserId }],
    game: null,
    createdAt: Date.now(),
  };

  console.log(`Lobby créé: ${code} par ${displayName} (${wonderId})`);
  res.json({ code, userId, username: displayName });
});

app.post('/api/lobby/join', (req, res) => {
  const { code, wonderId, wonderName, username, token } = req.body;
  if (!code || !wonderId) return res.status(400).json({ error: 'Code et merveille requis' });

  const lobby = lobbies[code.toUpperCase()];
  if (!lobby) return res.status(404).json({ error: 'Lobby introuvable' });
  if (lobby.status !== 'waiting') return res.status(400).json({ error: 'Partie déjà commencée' });
  if (lobby.players.length >= 6) return res.status(400).json({ error: 'Lobby plein (max 6 joueurs)' });

  // Vérifier que la merveille n'est pas déjà prise
  if (lobby.players.some(p => p.wonderId === wonderId)) {
    return res.status(400).json({ error: 'Cette merveille est déjà prise par un autre joueur' });
  }

  const userId = uuidv4();
  const displayName = username || wonderName;
  const authPayload = token ? verifyToken(token) : null;
  const dbUserId = authPayload?.userId || null;

  lobby.players.push({ userId, username: displayName, wonderId, ready: false, dbUserId });

  console.log(`${displayName} (${wonderId}) rejoint ${code}`);
  res.json({ code, userId, username: displayName });
});

app.get('/api/lobby/:code', (req, res) => {
  const lobby = lobbies[req.params.code.toUpperCase()];
  if (!lobby) return res.status(404).json({ error: 'Lobby introuvable' });
  const safe = { ...lobby, game: lobby.game ? sanitizeGame(lobby.game, null) : null };
  res.json(safe);
});

// Sanitize: masquer les mains des autres joueurs
function sanitizeGame(game, requestingUserId) {
  if (!game) return null;
  return {
    ...game,
    players: game.players.map(p => ({
      ...p,
      hand: p.userId === requestingUserId ? p.hand : p.hand.map(() => ({ hidden: true })),
    })),
  };
}

// ── SOCKET.IO ─────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`Socket connecté: ${socket.id}`);

  socket.on('joinRoom', ({ code, userId, username }) => {
    const lobbyCode = code.toUpperCase();
    socket.join(lobbyCode);
    socket.data.userId = userId;
    socket.data.username = username;
    socket.data.lobbyCode = lobbyCode;

    const lobby = lobbies[lobbyCode];
    if (lobby) {
      io.to(lobbyCode).emit('lobbyUpdate', {
        players: lobby.players,
        status: lobby.status,
        hostId: lobby.hostId,
      });
    }
    console.log(`${username} (${userId}) rejoint la room ${lobbyCode}`);
  });

  socket.on('startGame', ({ code, userId }) => {
    const lobby = lobbies[code.toUpperCase()];
    if (!lobby) return socket.emit('error', 'Lobby introuvable');
    if (lobby.hostId !== userId) return socket.emit('error', 'Seul le host peut démarrer');
    if (lobby.players.length < 2) return socket.emit('error', 'Minimum 2 joueurs (3 recommandé)');
    if (lobby.status !== 'waiting') return socket.emit('error', 'Partie déjà commencée');

    lobby.game = createGame(code, lobby.players);
    lobby.status = 'playing';

    lobby.players.forEach(p => {
      const sockets = [...io.sockets.sockets.values()].filter(
        s => s.data.userId === p.userId && s.data.lobbyCode === code.toUpperCase()
      );
      sockets.forEach(s => s.emit('gameStart', sanitizeGame(lobby.game, p.userId)));
    });

    console.log(`Partie démarrée: ${code} avec ${lobby.players.length} joueurs`);
  });

  socket.on('playCard', ({ code, userId, action, cardId }) => {
    const lobby = lobbies[code.toUpperCase()];
    if (!lobby || !lobby.game) return socket.emit('error', 'Partie introuvable');
    if (lobby.game.pendingMoves[userId]) return socket.emit('error', 'Tu as déjà joué ce tour');

    const result = processMove(lobby.game, userId, action, cardId);
    if (result.error) return socket.emit('error', result.error);

    socket.emit('moveConfirmed', { action, cardId });

    if (allPlayersReady(lobby.game)) {
      advanceTurn(lobby.game);

      lobby.players.forEach(p => {
        const sockets = [...io.sockets.sockets.values()].filter(
          s => s.data.userId === p.userId && s.data.lobbyCode === code.toUpperCase()
        );
        const gameData = sanitizeGame(lobby.game, p.userId);
        sockets.forEach(s => s.emit('gameUpdate', gameData));
      });

      if (lobby.game.status === 'finished') {
        // Calculer le classement final (tri par score décroissant)
        const sorted = [...lobby.game.players].sort((a, b) => {
          const scoreA = a.vp + Math.floor(a.coins / 3);
          const scoreB = b.vp + Math.floor(b.coins / 3);
          return scoreB - scoreA;
        });

        io.to(code.toUpperCase()).emit('gameOver', {
          players: sorted,
          winner: sorted[0],
        });

        // Sauvegarder les stats pour les joueurs authentifiés
        const playerCount = lobby.players.length;
        sorted.forEach(async (p, idx) => {
          const lobbyPlayer = lobby.players.find(lp => lp.userId === p.userId);
          const dbUserId = lobbyPlayer?.dbUserId;
          if (!dbUserId) return;
          const place = idx + 1;
          const score = p.vp + Math.floor(p.coins / 3);
          const wonder = p.wonder?.name || 'Inconnue';
          const pointsGained = await saveGameResult(code, dbUserId, wonder, place, score, playerCount);
          await updateUserStats(dbUserId, place, score, pointsGained);
        });
      }
    } else {
      const waiting = lobby.game.players
        .filter(p => !lobby.game.pendingMoves[p.userId])
        .map(p => p.username);
      io.to(code.toUpperCase()).emit('waitingFor', waiting);
    }
  });

  socket.on('chat', ({ code, username, message }) => {
    io.to(code.toUpperCase()).emit('chatMessage', {
      username,
      message,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    });
  });

  socket.on('disconnect', () => {
    const { userId, username, lobbyCode } = socket.data;
    if (lobbyCode && lobbies[lobbyCode]) {
      console.log(`${username} déconnecté de ${lobbyCode}`);
      io.to(lobbyCode).emit('playerDisconnected', { username });
    }
  });
});

// Nettoyage des lobbies inactifs toutes les heures
setInterval(() => {
  const now = Date.now();
  Object.keys(lobbies).forEach(code => {
    if (now - lobbies[code].createdAt > 3600000) {
      delete lobbies[code];
      console.log(`Lobby ${code} supprimé (inactif)`);
    }
  });
}, 3600000);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🎮 Serveur 7 Wonders démarré sur le port ${PORT}`);
  console.log(`   Frontend attendu sur: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
});
