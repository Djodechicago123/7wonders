-- ═══════════════════════════════════════════════════════
-- 7 WONDERS ONLINE — Schéma Supabase (optionnel)
-- ═══════════════════════════════════════════════════════
-- Ces tables sont OPTIONNELLES. Le jeu fonctionne sans.
-- À utiliser si tu veux sauvegarder les parties.

-- Table des joueurs/utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  games_played INT DEFAULT 0,
  games_won INT DEFAULT 0
);

-- Table des parties
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'waiting', -- waiting | playing | finished
  player_count INT DEFAULT 0,
  age INT DEFAULT 1,
  turn INT DEFAULT 1,
  winner_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

-- Table des joueurs dans une partie
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  username TEXT NOT NULL,
  wonder_name TEXT,
  wonder_icon TEXT,
  final_score INT,
  rank INT,
  coins INT DEFAULT 3,
  shields INT DEFAULT 0,
  vp INT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des coups joués (audit/replay)
CREATE TABLE moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  age INT NOT NULL,
  turn INT NOT NULL,
  action TEXT NOT NULL, -- play | sell | wonder
  card_name TEXT NOT NULL,
  card_type TEXT,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_games_code ON games(code);
CREATE INDEX idx_players_game_id ON players(game_id);
CREATE INDEX idx_moves_game_id ON moves(game_id);

-- Vue: classements globaux
CREATE VIEW leaderboard AS
SELECT
  u.username,
  u.games_played,
  u.games_won,
  ROUND(100.0 * u.games_won / NULLIF(u.games_played, 0), 1) AS win_rate
FROM users u
ORDER BY u.games_won DESC, win_rate DESC;
