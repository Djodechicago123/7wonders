// HomePage.jsx - Écran d'accueil avec sélecteur de merveille
import { useState } from 'react';
import { useGameStore } from '../lib/store';
import { useAuthStore } from '../lib/auth';

import gizehBoard      from '../assets/cards/wonder-board-gizeh.svg';
import rhodesBoard     from '../assets/cards/wonder-board-rhodes.svg';
import alexandrieBoard from '../assets/cards/wonder-board-alexandrie.svg';
import babyloneBoard   from '../assets/cards/wonder-board-babylone.svg';
import olympieBoard    from '../assets/cards/wonder-board-olympie.svg';
import halicarnasseBoard from '../assets/cards/wonder-board-halicarnasse.svg';
import epheseBoard     from '../assets/cards/wonder-board-ephese.svg';

const WONDERS_LIST = [
  { id: 'w-gizeh',        name: 'Gizeh',        subtitle: 'Les Pyramides',        region: 'Égypte',       resource: '🪨', icon: '🔺', color: '#D4AC0D', board: gizehBoard },
  { id: 'w-rhodes',       name: 'Rhodes',        subtitle: 'Le Colosse',           region: 'Grèce',        resource: '⚙️', icon: '🗿', color: '#EF5350', board: rhodesBoard },
  { id: 'w-alexandrie',   name: 'Alexandrie',    subtitle: 'Le Phare',             region: 'Égypte',       resource: '🔮', icon: '💡', color: '#42A5F5', board: alexandrieBoard },
  { id: 'w-babylone',     name: 'Babylone',      subtitle: 'Les Jardins Suspendus',region: 'Mésopotamie', resource: '🧱', icon: '🌿', color: '#FF7043', board: babyloneBoard },
  { id: 'w-olympie',      name: 'Olympie',       subtitle: 'La Statue de Zeus',    region: 'Grèce',        resource: '🪵', icon: '🔥', color: '#66BB6A', board: olympieBoard },
  { id: 'w-halicarnasse', name: 'Halicarnasse',  subtitle: 'Le Mausolée',          region: 'Anatolie',     resource: '🧵', icon: '🏺', color: '#CE93D8', board: halicarnasseBoard },
  { id: 'w-ephese',       name: 'Éphèse',        subtitle: "Le Temple d'Artémis",  region: 'Ionie',        resource: '📜', icon: '🏛️', color: '#FFA726', board: epheseBoard },
];

export default function HomePage({ onProfile, onLeaderboard }) {
  const [tab, setTab] = useState('create');
  const [selectedWonder, setSelectedWonder] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { createLobby, joinLobby, error, clearError } = useGameStore();
  const { user, logout } = useAuthStore();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedWonder) return;
    setLoading(true);
    await createLobby(selectedWonder.id, selectedWonder.name, user?.username || selectedWonder.name);
    setLoading(false);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!selectedWonder || !code.trim()) return;
    setLoading(true);
    await joinLobby(code.trim().toUpperCase(), selectedWonder.id, selectedWonder.name, user?.username || selectedWonder.name);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #2c1810 0%, #1a1208 60%, #0d0905 100%)' }}>

      {/* Fond étoilé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-gold-300 opacity-20"
            style={{
              width: Math.random() * 2 + 1 + 'px', height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
              animation: `glow-pulse ${2 + Math.random() * 3}s infinite`,
              animationDelay: Math.random() * 3 + 's',
            }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-xl px-4 animate-float-in">

        {/* Barre utilisateur */}
        {user && (
          <div className="flex items-center justify-between mb-4 panel p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-black"
                style={{ background: user.avatar_color + '33', border: `2px solid ${user.avatar_color}`, color: user.avatar_color }}>
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-body font-semibold text-gold-400">{user.username}</p>
                <p className="text-xs font-body text-ancient-stone">⭐ {user.ranking_points} pts</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={onProfile} className="btn-ghost text-xs px-2 py-1 rounded-lg">👤</button>
              <button onClick={onLeaderboard} className="btn-ghost text-xs px-2 py-1 rounded-lg">🏆</button>
              <button onClick={logout} className="btn-ghost text-xs px-2 py-1 rounded-lg text-red-400 border-red-800/40">↩</button>
            </div>
          </div>
        )}

        {/* Titre */}
        <div className="text-center mb-6">
          <h1 className="text-shimmer font-display text-5xl font-black mb-1 tracking-wider">7 WONDERS</h1>
          <p className="text-ancient-sand font-body text-sm tracking-[0.3em] uppercase opacity-70">Construis ta civilisation</p>
          <div className="gold-divider mt-3" />
        </div>

        {/* Formulaire */}
        <div className="panel-gold p-5">
          {/* Onglets */}
          <div className="flex mb-5 bg-black/30 rounded-lg p-1 gap-1">
            {[{ id: 'create', label: '⚔️ Créer une partie' }, { id: 'join', label: '🤝 Rejoindre' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-body font-semibold transition-all ${
                  tab === t.id ? 'bg-gradient-to-r from-gold-600 to-gold-700 text-ancient-dark shadow-lg' : 'text-ancient-sand hover:text-gold-400'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-xs font-body flex justify-between">
              <span>⚠️ {error}</span>
              <button onClick={clearError} className="text-red-400 hover:text-red-200">✕</button>
            </div>
          )}

          <form onSubmit={tab === 'create' ? handleCreate : handleJoin} className="space-y-4">

            {/* Code de partie (join uniquement) */}
            {tab === 'join' && (
              <div>
                <label className="block text-xs font-body text-ancient-sand mb-1 uppercase tracking-widest">
                  Code de la partie
                </label>
                <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: AB12CD" maxLength={6} required
                  className="w-full px-4 py-3 bg-black/40 border border-gold-700/40 rounded-lg text-gold-300 font-display
                    text-xl text-center tracking-[0.5em] placeholder-ancient-stone focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
            )}

            {/* Sélecteur de merveille */}
            <WonderPicker selected={selectedWonder} onSelect={setSelectedWonder} />

            <button type="submit"
              disabled={loading || !selectedWonder || (tab === 'join' && !code.trim())}
              className="btn-gold w-full py-3 rounded-lg font-display text-sm tracking-widest">
              {loading ? '⌛ Connexion...' :
                selectedWonder
                  ? (tab === 'create' ? `🏛️ JOUER AVEC ${selectedWonder.name.toUpperCase()}` : `⚔️ REJOINDRE AVEC ${selectedWonder.name.toUpperCase()}`)
                  : '← Choisis une merveille'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function WonderPicker({ selected, onSelect }) {
  return (
    <div>
      <p className="text-xs font-body text-ancient-sand mb-2 uppercase tracking-widest">
        Choisis ta merveille
      </p>
      <div className="grid grid-cols-4 gap-2">
        {WONDERS_LIST.map(w => {
          const isSelected = selected?.id === w.id;
          return (
            <button key={w.id} type="button" onClick={() => onSelect(w)}
              style={{
                position: 'relative', borderRadius: 10, overflow: 'hidden', padding: 0,
                border: `2px solid ${isSelected ? w.color : 'rgba(212,172,13,0.15)'}`,
                transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                transition: 'all 0.18s ease',
                boxShadow: isSelected ? `0 0 12px ${w.color}66` : 'none',
                cursor: 'pointer',
              }}>
              <img src={w.board} alt={w.name}
                onError={e => { e.target.style.display = 'none'; }}
                style={{ width: '100%', height: 70, objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: isSelected
                  ? `linear-gradient(to top, ${w.color}99 0%, rgba(0,0,0,0.2) 100%)`
                  : 'linear-gradient(to top, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: '4px 5px',
              }}>
                <p style={{ fontFamily: 'Cinzel, serif', fontSize: 9, fontWeight: 'bold', color: isSelected ? '#fff' : w.color, lineHeight: 1.2, textAlign: 'center' }}>
                  {w.name}
                </p>
                <p style={{ fontFamily: 'sans-serif', fontSize: 8, color: 'rgba(200,169,110,0.8)', textAlign: 'center' }}>
                  {w.resource}
                </p>
              </div>
            </button>
          );
        })}
        {/* Case vide pour aligner la grille 7→4+3 */}
        <div />
      </div>

      {/* Détail de la merveille sélectionnée */}
      {selected && (
        <div className="mt-3 p-3 rounded-lg flex items-center gap-3"
          style={{ background: selected.color + '15', border: `1px solid ${selected.color}44` }}>
          <span className="text-3xl">{selected.icon}</span>
          <div>
            <p className="font-display font-bold text-sm" style={{ color: selected.color }}>
              {selected.name} — {selected.subtitle}
            </p>
            <p className="font-body text-xs text-ancient-stone">
              {selected.region} · Ressource de départ : {selected.resource}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
