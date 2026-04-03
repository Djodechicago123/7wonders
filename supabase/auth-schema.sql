-- auth-schema.sql — Schéma Supabase pour 7 Wonders
-- À exécuter dans : Supabase → SQL Editor → New query

-- ── TABLE UTILISATEURS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  username       TEXT        UNIQUE NOT NULL
                             CHECK (length(username) BETWEEN 3 AND 20)
                             CHECK (username ~ '^[a-zA-Z0-9_]+$'),
  email          TEXT        UNIQUE NOT NULL,
  password_hash  TEXT        NOT NULL,
  avatar_color   TEXT        NOT NULL DEFAULT '#D4AC0D',
  ranking_points INTEGER     NOT NULL DEFAULT 1000,
  games_played   INTEGER     NOT NULL DEFAULT 0,
  games_won      INTEGER     NOT NULL DEFAULT 0,
  best_score     INTEGER     NOT NULL DEFAULT 0,
  current_streak INTEGER     NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── TABLE RÉSULTATS DE PARTIES ───────────────────────────────
CREATE TABLE IF NOT EXISTS game_results (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id               TEXT        NOT NULL,
  user_id               UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wonder                TEXT        NOT NULL,
  place                 INTEGER     NOT NULL CHECK (place >= 1),
  score                 INTEGER     NOT NULL,
  ranking_points_gained INTEGER     NOT NULL DEFAULT 0,
  players_count         INTEGER     NOT NULL,
  played_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── INDEX ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_game_results_user_id ON game_results(user_id);
CREATE INDEX IF NOT EXISTS idx_game_results_played_at ON game_results(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_ranking ON users(ranking_points DESC);

-- ── VUE CLASSEMENT ───────────────────────────────────────────
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  id,
  username,
  avatar_color,
  ranking_points,
  games_played,
  games_won,
  best_score,
  CASE
    WHEN games_played > 0
    THEN ROUND((games_won::DECIMAL / games_played) * 100, 1)
    ELSE 0
  END AS win_rate,
  RANK() OVER (ORDER BY ranking_points DESC) AS global_rank
FROM users
ORDER BY ranking_points DESC;
