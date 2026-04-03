// ProfilePage.jsx — Profil joueur
import { useState, useEffect } from 'react';
import { useAuthStore } from '../lib/auth';

const WONDER_ICONS = {
  Rhodes: '🗿', Alexandrie: '📚', 'Ephèse': '🏛️', Babylone: '⭐',
  Olympie: '🔥', Halicarnasse: '🏺', Gizeh: '🔺',
};

export default function ProfilePage({ onBack }) {
  const { user, logout, fetchHistory, fetchLeaderboard } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetchHistory(user.id),
      fetchLeaderboard(),
    ]).then(([hist, board]) => {
      setHistory(hist || []);
      const me = board.find(p => p.id === user.id);
      setRank(me ? { rank: me.global_rank, total: board.length } : null);
      setLoading(false);
    });
  }, [user]);

  if (!user) return null;

  const winRate = user.games_played > 0
    ? ((user.games_won / user.games_played) * 100).toFixed(1)
    : '0.0';

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen p-4 overflow-y-auto"
      style={{ background: 'radial-gradient(ellipse at top, #2c1810 0%, #1a1208 100%)' }}>
      <div className="max-w-lg mx-auto animate-float-in">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="btn-ghost px-3 py-2 rounded-lg text-sm font-body">
            ← Retour
          </button>
          <h1 className="font-display text-gold-400 text-xl font-black tracking-wider">MON PROFIL</h1>
        </div>

        {/* Identité */}
        <div className="panel-gold p-6 mb-4 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-display font-black flex-shrink-0"
            style={{ background: user.avatar_color + '33', border: `3px solid ${user.avatar_color}`, color: user.avatar_color }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-black text-2xl text-gold-400">{user.username}</h2>
            <p className="text-xs font-body text-ancient-stone truncate">{user.email}</p>
            <p className="text-xs font-body text-ancient-stone mt-1 opacity-70">
              Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
            {rank && (
              <p className="text-xs font-body mt-1" style={{ color: user.avatar_color }}>
                🏆 Rang #{rank.rank} mondial
              </p>
            )}
          </div>
          <button onClick={logout}
            className="btn-ghost text-xs px-3 py-2 rounded-lg text-red-400 border-red-800/40 flex-shrink-0">
            Déco
          </button>
        </div>

        {/* Stats */}
        <div className="panel p-5 mb-4">
          <h3 className="font-display text-gold-400 text-xs tracking-widest mb-4 uppercase">Statistiques</h3>
          <div className="grid grid-cols-3 gap-3">
            <StatCell label="Parties" value={user.games_played} icon="🎮" />
            <StatCell label="Victoires" value={user.games_won} icon="🏆" color="#66BB6A" />
            <StatCell label="Win Rate" value={`${winRate}%`} icon="📊" color="#42A5F5" />
            <StatCell label="Points" value={user.ranking_points} icon="⭐" color="#D4AC0D" />
            <StatCell label="Meilleur score" value={user.best_score} icon="🎯" color="#CE93D8" />
            <StatCell label="Série" value={user.current_streak} icon="🔥" color="#FF7043" />
          </div>
        </div>

        {/* Rang global */}
        {rank && (
          <div className="panel p-5 mb-4">
            <h3 className="font-display text-gold-400 text-xs tracking-widest mb-3 uppercase">Classement mondial</h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-display font-black text-gold-400">#{rank.rank}</div>
              <div className="flex-1">
                <p className="text-sm font-body text-ancient-sand">{user.ranking_points} points ELO</p>
                <div className="mt-2 h-2 rounded-full bg-ancient-brown/40 overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (user.ranking_points / 2000) * 100)}%`,
                      background: 'linear-gradient(90deg, #D4AC0D, #FFD700)',
                    }} />
                </div>
                <p className="text-xs font-body text-ancient-stone mt-1 opacity-70">
                  {Math.max(0, 2000 - user.ranking_points)} pts vers l'élite (2000)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Historique */}
        <div className="panel p-5">
          <h3 className="font-display text-gold-400 text-xs tracking-widest mb-4 uppercase">
            10 dernières parties
          </h3>
          {loading ? (
            <p className="text-ancient-stone font-body text-sm text-center py-4">Chargement...</p>
          ) : history.length === 0 ? (
            <p className="text-ancient-stone font-body text-sm text-center py-4 opacity-60">
              Aucune partie enregistrée
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((h, i) => {
                const placeColor = h.place === 1 ? '#66BB6A' : h.place <= 3 ? '#FF7043' : '#78909C';
                const placeMedal = h.place === 1 ? '🥇' : h.place === 2 ? '🥈' : h.place === 3 ? '🥉' : `#${h.place}`;
                return (
                  <div key={h.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{ background: h.place === 1 ? 'rgba(102,187,106,0.08)' : 'rgba(0,0,0,0.2)' }}>
                    <span className="text-lg w-8 text-center flex-shrink-0">{typeof placeMedal === 'string' && placeMedal.startsWith('#') ? placeMedal : placeMedal}</span>
                    <span className="text-lg flex-shrink-0">{WONDER_ICONS[h.wonder] || '🏛️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-body font-semibold" style={{ color: '#f5e6c8' }}>{h.wonder}</p>
                      <p className="text-xs font-body text-ancient-stone">
                        {new Date(h.played_at).toLocaleDateString('fr-FR')} • {h.players_count} joueurs
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-display font-bold text-gold-400">{h.score} VP</p>
                      <p className="text-xs font-body" style={{ color: h.ranking_points_gained >= 0 ? '#66BB6A' : '#EF5350' }}>
                        {h.ranking_points_gained >= 0 ? '+' : ''}{h.ranking_points_gained} pts
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value, icon, color = '#f5e6c8' }) {
  return (
    <div className="text-center p-3 rounded-lg" style={{ background: (color || '#D4AC0D') + '11', border: `1px solid ${color}22` }}>
      <p className="text-lg mb-0.5">{icon}</p>
      <p className="font-display font-black text-lg leading-none" style={{ color }}>{value}</p>
      <p className="text-xs font-body text-ancient-stone mt-1 opacity-70">{label}</p>
    </div>
  );
}
