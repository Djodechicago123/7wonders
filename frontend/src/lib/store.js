// store.js - État global du jeu avec Zustand
import { create } from 'zustand';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useGameStore = create((set, get) => ({
  // ── Auth / Lobby ──────────────────────────────
  userId: null,
  username: null,
  lobbyCode: null,
  lobbyPlayers: [],
  isHost: false,

  // ── Jeu ──────────────────────────────────────
  game: null,
  myPlayer: null,
  selectedCard: null,
  selectedAction: null,
  waitingFor: [],
  hasPlayedThisTurn: false,
  gameOver: false,
  finalScores: [],

  // ── UI ────────────────────────────────────────
  chatMessages: [],
  notification: null,
  socket: null,
  connected: false,
  error: null,
  phase: 'home', // 'home' | 'lobby' | 'game' | 'gameover'

  // ── Actions ──────────────────────────────────
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  setNotification: (msg) => {
    set({ notification: msg });
    setTimeout(() => set({ notification: null }), 3000);
  },

  selectCard: (card) => {
    const { selectedCard } = get();
    if (selectedCard?.uniqueId === card?.uniqueId || selectedCard?.id === card?.id) {
      set({ selectedCard: null, selectedAction: null });
    } else {
      set({ selectedCard: card, selectedAction: null });
    }
  },

  selectAction: (action) => set({ selectedAction: action }),

  connectSocket: () => {
    const existing = get().socket;
    if (existing?.connected) return;

    const socket = io(BACKEND_URL, { withCredentials: true, transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      set({ connected: true });
      console.log('Socket connecté');
      const { lobbyCode, userId, username } = get();
      if (lobbyCode && userId) {
        socket.emit('joinRoom', { code: lobbyCode, userId, username });
      }
    });

    socket.on('disconnect', () => set({ connected: false }));

    socket.on('lobbyUpdate', ({ players, status, hostId }) => {
      const { userId } = get();
      set({ lobbyPlayers: players, isHost: hostId === userId });
    });

    socket.on('gameStart', (game) => {
      const { userId } = get();
      const myPlayer = game.players.find(p => p.userId === userId);
      set({ game, myPlayer, phase: 'game', hasPlayedThisTurn: false });
      get().setNotification('✨ La partie commence ! Âge I');
    });

    socket.on('gameUpdate', (game) => {
      const { userId } = get();
      const myPlayer = game.players.find(p => p.userId === userId);
      set({ game, myPlayer, selectedCard: null, selectedAction: null, hasPlayedThisTurn: false, waitingFor: [] });
    });

    socket.on('moveConfirmed', ({ action }) => {
      set({ hasPlayedThisTurn: true, selectedCard: null, selectedAction: null });
      const labels = { play: 'construite ✅', sell: 'vendue 💰', wonder: 'Merveille construite 🏛️' };
      get().setNotification(`Carte ${labels[action] || action}`);
    });

    socket.on('waitingFor', (waiting) => {
      set({ waitingFor: waiting });
    });

    socket.on('gameOver', ({ players, winner }) => {
      set({ gameOver: true, finalScores: players, phase: 'gameover' });
    });

    socket.on('chatMessage', (msg) => {
      set(state => ({ chatMessages: [...state.chatMessages.slice(-50), msg] }));
    });

    socket.on('playerDisconnected', ({ username }) => {
      get().setNotification(`⚠️ ${username} s'est déconnecté`);
    });

    socket.on('error', (msg) => {
      set({ error: msg });
      setTimeout(() => set({ error: null }), 4000);
    });

    set({ socket });
  },

  createLobby: async (username) => {
    try {
      const token = localStorage.getItem('7wonders_token');
      const res = await fetch(`${BACKEND_URL}/api/lobby/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, token }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      set({ userId: data.userId, username: data.username, lobbyCode: data.code, isHost: true, phase: 'lobby' });
      get().connectSocket();

      const socket = get().socket;
      setTimeout(() => {
        const s = get().socket;
        if (s?.connected) s.emit('joinRoom', { code: data.code, userId: data.userId, username: data.username });
      }, 500);

      return data.code;
    } catch (err) {
      set({ error: err.message });
      return null;
    }
  },

  joinLobby: async (code, username) => {
    try {
      const token = localStorage.getItem('7wonders_token');
      const res = await fetch(`${BACKEND_URL}/api/lobby/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, username, token }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      set({ userId: data.userId, username: data.username, lobbyCode: data.code, isHost: false, phase: 'lobby' });
      get().connectSocket();

      setTimeout(() => {
        const s = get().socket;
        if (s?.connected) s.emit('joinRoom', { code: data.code, userId: data.userId, username: data.username });
      }, 500);

      return data.code;
    } catch (err) {
      set({ error: err.message });
      return null;
    }
  },

  startGame: () => {
    const { socket, lobbyCode, userId } = get();
    if (!socket) return;
    socket.emit('startGame', { code: lobbyCode, userId });
  },

  playCard: () => {
    const { socket, lobbyCode, userId, selectedCard, selectedAction, hasPlayedThisTurn } = get();
    if (!socket || !selectedCard || !selectedAction || hasPlayedThisTurn) return;

    socket.emit('playCard', {
      code: lobbyCode,
      userId,
      action: selectedAction,
      cardId: selectedCard.uniqueId || selectedCard.id,
    });
  },

  sendChat: (message) => {
    const { socket, lobbyCode, username } = get();
    if (!socket || !message.trim()) return;
    socket.emit('chat', { code: lobbyCode, username, message });
  },

  returnToHome: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    set({
      userId: null, username: null, lobbyCode: null, lobbyPlayers: [], isHost: false,
      game: null, myPlayer: null, selectedCard: null, selectedAction: null,
      waitingFor: [], hasPlayedThisTurn: false, gameOver: false, finalScores: [],
      chatMessages: [], socket: null, connected: false, error: null, phase: 'home',
    });
  },
}));
