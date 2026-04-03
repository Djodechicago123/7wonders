// auth.js — Store Zustand pour l'authentification
import { create } from 'zustand';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const TOKEN_KEY = '7wonders_token';

export const useAuthStore = create((set, get) => ({
  user: null,   // { id, username, email, avatarColor, ... }
  token: null,
  stats: null,  // ranking_points, global_rank, ...
  loading: true,
  error: null,

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Appelé au démarrage — charge le profil si token en localStorage
  loadProfile: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { set({ loading: false }); return; }

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Token expiré');
      const user = await res.json();
      set({ user, token, loading: false });
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, token: null, loading: false });
    }
  },

  login: async (email, password) => {
    set({ error: null });
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
    localStorage.setItem(TOKEN_KEY, data.token);
    set({ user: data.user, token: data.token, error: null });
    return data;
  },

  register: async (username, email, password) => {
    set({ error: null });
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur d\'inscription');
    localStorage.setItem(TOKEN_KEY, data.token);
    set({ user: data.user, token: data.token, error: null });
    return data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null, stats: null, error: null });
  },

  fetchLeaderboard: async () => {
    const res = await fetch(`${BACKEND_URL}/api/leaderboard`);
    if (!res.ok) return [];
    return res.json();
  },

  fetchHistory: async (userId) => {
    const { token } = get();
    if (!token) return [];
    const res = await fetch(`${BACKEND_URL}/api/users/${userId}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return res.json();
  },
}));
