// LobbyPage.jsx - Salle d'attente
import { useGameStore } from '../lib/store';
import { useAuthStore } from '../lib/auth';

export default function LobbyPage({ onProfile, onLeaderboard }) {
  const { lobbyPlayers, lobbyCode, isHost, startGame, username, returnToHome } = useGameStore();
  const { user, logout } = useAuthStore();

  const canStart = lobbyPlayers.length >= 2 && isHost;

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at top, #2c1810 0%, #1a1208 100%)' }}>
      <div className="w-full max-w-lg animate-float-in">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-shimmer font-display text-4xl font-black mb-1">7 WONDERS</h1>
          <p className="text-ancient-sand font-body text-xs tracking-widest uppercase">Salle d'attente</p>
        </div>

        {/* Joueur connecté */}
        {user && (
          <div className="panel p-3 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-black flex-shrink-0"
              style={{ background: user.avatar_color + '33', border: `2px solid ${user.avatar_color}`, color: user.avatar_color }}>
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-sm text-gold-400 truncate">{user.username}</p>
              <p className="font-body text-xs text-ancient-stone">⭐ {user.ranking_points} pts</p>
            </div>
            <button onClick={onProfile}
              className="btn-ghost text-xs px-3 py-1.5 rounded-lg">👤 Profil</button>
            <button onClick={onLeaderboard}
              className="btn-ghost text-xs px-3 py-1.5 rounded-lg">🏆 Top</button>
            <button onClick={logout}
              className="btn-ghost text-xs px-3 py-1.5 rounded-lg text-red-400 border-red-800/40">↩</button>
          </div>
        )}

        {/* Code de la partie */}
        <div className="panel-gold p-6 mb-4 text-center">
          <p className="text-ancient-sand text-xs font-body uppercase tracking-widest mb-2">Code de la partie</p>
          <div className="text-5xl font-display font-black tracking-[0.4em] text-gold-400 mb-2"
            style={{ textShadow: '0 0 20px rgba(212,172,13,0.5)' }}>
            {lobbyCode}
          </div>
          <p className="text-ancient-stone text-xs font-body">Partage ce code avec tes amis</p>
          <button
            onClick={() => navigator.clipboard?.writeText(lobbyCode)}
            className="mt-3 btn-ghost text-xs px-4 py-2 rounded-lg">
            📋 Copier le code
          </button>
        </div>

        {/* Liste des joueurs */}
        <div className="panel p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-gold-400 text-sm tracking-wider">
              ⚔️ JOUEURS ({lobbyPlayers.length}/6)
            </h2>
            <span className="text-xs font-body text-ancient-stone">
              {lobbyPlayers.length < 3 ? `Encore ${3 - lobbyPlayers.length} joueur(s)...` : 'Prêt !'}
            </span>
          </div>

          <div className="space-y-2">
            {lobbyPlayers.map((p, i) => (
              <div key={p.userId} className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: p.username === username ? 'rgba(212,172,13,0.1)' : 'rgba(0,0,0,0.2)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold"
                  style={{ background: `hsl(${i * 51}, 60%, 40%)`, color: '#f5e6c8' }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-body font-semibold"
                    style={{ color: p.username === username ? '#fde047' : '#f5e6c8' }}>
                    {p.username}
                    {p.username === username && <span className="text-xs text-ancient-stone ml-2">(toi)</span>}
                  </p>
                </div>
                {i === 0 && (
                  <span className="text-xs bg-gold-700/30 text-gold-400 px-2 py-1 rounded font-body">👑 Host</span>
                )}
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            ))}

            {[...Array(Math.max(0, 6 - lobbyPlayers.length))].map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-ancient-stone/20">
                <div className="w-8 h-8 rounded-full border border-ancient-stone/20 flex items-center justify-center text-ancient-stone">
                  {lobbyPlayers.length + i + 1}
                </div>
                <span className="text-xs text-ancient-stone font-body">En attente...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isHost ? (
            <button onClick={startGame} disabled={!canStart}
              className="btn-gold w-full py-4 rounded-lg font-display text-base tracking-widest animate-glow">
              {canStart ? '🏛️ DÉMARRER LA PARTIE' : `⏳ ATTENTE (${lobbyPlayers.length < 2 ? 'min. 2 joueurs' : 'chargement'})`}
            </button>
          ) : (
            <div className="panel p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-ancient-sand">
                <div className="w-3 h-3 rounded-full bg-gold-400 animate-pulse" />
                <span className="font-body text-sm">En attente que le host démarre...</span>
              </div>
            </div>
          )}

          <button onClick={returnToHome}
            className="btn-ghost w-full py-3 rounded-lg text-sm font-body">
            ← Quitter le lobby
          </button>
        </div>

        {/* Règles rapides */}
        <div className="mt-6 panel p-4">
          <h3 className="text-gold-400 font-display text-xs tracking-widest mb-3">📜 RÈGLES RAPIDES</h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-body text-ancient-sand">
            <p>🎴 Chaque tour: choisir une carte</p>
            <p>🔄 Les mains tournent entre joueurs</p>
            <p>⚔️ Combats militaires à chaque âge</p>
            <p>🏛️ Construis ta merveille en 3 étapes</p>
            <p>💰 Vends une carte pour 3 pièces</p>
            <p>🎯 Max de points à la fin de l'âge 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
