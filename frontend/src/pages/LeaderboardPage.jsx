// LeaderboardPage.jsx — Classement mondial top 50
import { useState, useEffect } from 'react';
import { useAuthStore } from '../lib/auth';

export default function LeaderboardPage({ onBack }) {
  const { user, fetchLeaderboard } = useAuthStore();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard().then(data => {
      setRows(data || []);
      setLoading(false);
    });
  }, []);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="min-h-screen p-4 overflow-y-auto"
      style={{ background: 'radial-gradient(ellipse at top, #2c1810 0%, #1a1208 100%)' }}>
      <div className="max-w-2xl mx-auto animate-float-in">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="btn-ghost px-3 py-2 rounded-lg text-sm font-body">
            ← Retour
          </button>
          <h1 className="font-display text-gold-400 text-xl font-black tracking-wider">CLASSEMENT MONDIAL</h1>
        </div>

        {/* Podium top 3 */}
        {!loading && top3.length > 0 && (
          <div className="flex items-end justify-center gap-3 mb-6">
            {/* 2e */}
            {top3[1] && <PodiumCard row={top3[1]} medal="🥈" height={80} isMe={top3[1].id === user?.id} />}
            {/* 1er */}
            {top3[0] && <PodiumCard row={top3[0]} medal="🥇" height={104} isMe={top3[0].id === user?.id} big />}
            {/* 3e */}
            {top3[2] && <PodiumCard row={top3[2]} medal="🥉" height={64} isMe={top3[2].id === user?.id} />}
          </div>
        )}

        {/* Tableau */}
        <div className="panel overflow-hidden">
          <div className="grid text-xs font-body uppercase tracking-wider text-ancient-stone px-4 py-2 border-b border-gold-800/20"
            style={{ gridTemplateColumns: '40px 1fr 80px 60px 60px 50px' }}>
            <span>Rang</span>
            <span>Joueur</span>
            <span className="text-right">Points</span>
            <span className="text-right">Parties</span>
            <span className="text-right">Victoires</span>
            <span className="text-right">Win%</span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-ancient-stone font-body text-sm">Chargement...</div>
          ) : rest.length === 0 && top3.length === 0 ? (
            <div className="text-center py-8 text-ancient-stone font-body text-sm opacity-60">
              Aucun joueur classé pour l'instant
            </div>
          ) : (
            <div>
              {rest.map(row => {
                const isMe = row.id === user?.id;
                return (
                  <div key={row.id}
                    className="grid items-center px-4 py-2.5 border-b border-gold-800/10 text-xs font-body transition-colors"
                    style={{
                      gridTemplateColumns: '40px 1fr 80px 60px 60px 50px',
                      background: isMe ? 'rgba(212,172,13,0.08)' : 'transparent',
                    }}>
                    <span className="font-display font-bold" style={{ color: isMe ? '#D4AC0D' : '#78909C' }}>
                      #{row.global_rank}
                    </span>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-bold flex-shrink-0"
                        style={{ background: (row.avatar_color || '#D4AC0D') + '33', color: row.avatar_color || '#D4AC0D', border: `1px solid ${row.avatar_color || '#D4AC0D'}66` }}>
                        {row.username.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="truncate font-semibold" style={{ color: isMe ? '#D4AC0D' : '#f5e6c8' }}>
                        {row.username}{isMe && ' (toi)'}
                      </span>
                    </div>
                    <span className="text-right font-display font-bold text-gold-400">{row.ranking_points}</span>
                    <span className="text-right text-ancient-stone">{row.games_played}</span>
                    <span className="text-right" style={{ color: '#66BB6A' }}>{row.games_won}</span>
                    <span className="text-right text-ancient-stone">{row.win_rate}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-center text-xs font-body text-ancient-stone mt-4 opacity-50">
          Top 50 mis à jour après chaque partie
        </p>
      </div>
    </div>
  );
}

function PodiumCard({ row, medal, height, isMe, big = false }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-display font-black"
        style={{
          background: (row.avatar_color || '#D4AC0D') + '33',
          border: `2px solid ${isMe ? '#FFD700' : (row.avatar_color || '#D4AC0D')}`,
          color: row.avatar_color || '#D4AC0D',
        }}>
        {row.username.slice(0, 1).toUpperCase()}
      </div>
      <p className={`font-body font-bold truncate max-w-full text-center ${big ? 'text-sm' : 'text-xs'}`}
        style={{ color: isMe ? '#FFD700' : '#f5e6c8' }}>
        {row.username}
      </p>
      <p className="text-xs font-display font-bold text-gold-400">{row.ranking_points} pts</p>
      <div className="w-full rounded-t-lg flex items-end justify-center pb-2"
        style={{ height, background: 'rgba(212,172,13,0.12)', border: '1px solid rgba(212,172,13,0.2)', borderBottom: 'none' }}>
        <span className="text-2xl">{medal}</span>
      </div>
    </div>
  );
}
