// auth.js — Inscription, connexion, vérification JWT
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('./supabase');

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
const JWT_EXPIRES = '30d';

const AVATAR_COLORS = [
  '#D4AC0D', '#EF5350', '#42A5F5', '#66BB6A',
  '#CE93D8', '#FF7043', '#26C6DA', '#AB47BC',
];

async function register(username, email, password) {
  if (!username || username.length < 3 || username.length > 20)
    throw new Error('Le pseudo doit faire entre 3 et 20 caractères');
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    throw new Error('Le pseudo ne peut contenir que des lettres, chiffres et _');
  if (!email || !email.includes('@'))
    throw new Error('Adresse email invalide');
  if (!password || password.length < 8)
    throw new Error('Le mot de passe doit faire au moins 8 caractères');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

  const { data, error } = await supabase
    .from('users')
    .insert({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      avatar_color: avatarColor,
    })
    .select('id, username, email, avatar_color, ranking_points, games_played, games_won, best_score, current_streak, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      if (error.message.includes('username')) throw new Error('Ce pseudo est déjà pris');
      if (error.message.includes('email'))    throw new Error('Cet email est déjà utilisé');
    }
    console.error('[auth] register:', error);
    throw new Error('Erreur lors de l\'inscription');
  }

  const token = jwt.sign({ userId: data.id, username: data.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { token, user: data };
}

async function login(email, password) {
  if (!email || !password) throw new Error('Email et mot de passe requis');

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !user) throw new Error('Email ou mot de passe incorrect');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Email ou mot de passe incorrect');

  const { password_hash, ...safeUser } = user;
  const token = jwt.sign({ userId: safeUser.id, username: safeUser.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { token, user: safeUser };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Middleware Express
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Non authentifié' });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return res.status(401).json({ error: 'Token invalide ou expiré' });
  req.auth = payload;
  next();
}

async function getProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, avatar_color, ranking_points, games_played, games_won, best_score, current_streak, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) throw new Error('Profil introuvable');
  return data;
}

module.exports = { register, login, verifyToken, requireAuth, getProfile };
