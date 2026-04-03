// supabase.js — Client Supabase + fonctions DB
const { createClient } = require('@supabase/supabase-js');

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
} else {
  console.warn('[supabase] SUPABASE_URL ou SUPABASE_SERVICE_KEY manquant — stats désactivées');
}

// Points gagnés/perdus selon la place
function calcRankingPoints(place, playerCount) {
  const table = { 1: 25, 2: 12, 3: 4, 4: -5, 5: -12, 6: -18 };
  const base = table[place] ?? -18;
  // Léger bonus si plus de joueurs (seulement pour le vainqueur)
  const bonus = place === 1 ? Math.max(0, playerCount - 3) * 2 : 0;
  return base + bonus;
}

async function saveGameResult(gameId, userId, wonder, place, score, playerCount) {
  if (!userId || !supabase) return 0;
  const pointsGained = calcRankingPoints(place, playerCount);

  const { error } = await supabase.from('game_results').insert({
    game_id: gameId,
    user_id: userId,
    wonder,
    place,
    score,
    ranking_points_gained: pointsGained,
    players_count: playerCount,
  });

  if (error) console.error('[supabase] saveGameResult:', error.message);
  return pointsGained;
}

async function updateUserStats(userId, place, score, pointsGained) {
  if (!userId || !supabase) return;

  const { data: user, error } = await supabase
    .from('users')
    .select('games_played, games_won, best_score, current_streak, ranking_points')
    .eq('id', userId)
    .single();

  if (error || !user) return;

  await supabase.from('users').update({
    games_played:   user.games_played + 1,
    games_won:      place === 1 ? user.games_won + 1 : user.games_won,
    best_score:     Math.max(user.best_score, score),
    current_streak: place === 1 ? user.current_streak + 1 : 0,
    ranking_points: Math.max(0, user.ranking_points + pointsGained),
  }).eq('id', userId);
}

async function getLeaderboard() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(50);

  if (error) { console.error('[supabase] getLeaderboard:', error.message); return []; }
  return data;
}

async function getUserHistory(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('game_results')
    .select('*')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(10);

  if (error) { console.error('[supabase] getUserHistory:', error.message); return []; }
  return data;
}

module.exports = { supabase, saveGameResult, updateUserStats, getLeaderboard, getUserHistory };
