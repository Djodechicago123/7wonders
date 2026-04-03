// HomePage.jsx - Écran d'accueil
import { useState } from 'react';
import { useGameStore } from '../lib/store';

const WONDERS_BG = [
  { name: 'Gizeh', icon: '🔺', color: '#D4AC0D' },
  { name: 'Rhodes', icon: '🗿', color: '#C62828' },
  { name: 'Alexandrie', icon: '📚', color: '#1565C0' },
  { name: 'Babylone', icon: '⭐', color: '#7B241C' },
  { name: 'Olympie', icon: '🔥', color: '#2E7D32' },
  { name: 'Ephèse', icon: '🏛️', color: '#6A1B9A' },
  { name: 'Halicarnasse', icon: '🏺', color: '#E65100' },
];

export default function HomePage() {
  const [tab, setTab] = useState('create'); // 'create' | 'join'
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { createLobby, joinLobby, error, clearError } = useGameStore();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    await createLobby(username.trim());
    setLoading(false);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !code.trim()) return;
    setLoading(true);
    await joinLobby(code.trim().toUpperCase(), username.trim());
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #2c1810 0%, #1a1208 60%, #0d0905 100%)' }}>

      {/* Étoiles de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-gold-300 opacity-30"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `glow-pulse ${2 + Math.random() * 3}s infinite`,
              animationDelay: Math.random() * 3 + 's',
            }} />
        ))}
      </div>

      {/* Merveilles décoratifs en fond */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="text-[40rem] font-display">🔺</div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-md px-4 animate-float-in">
        {/* Titre */}
        <div className="text-center mb-10">
          <div className="flex justify-center gap-3 mb-4 text-3xl">
            {WONDERS_BG.map(w => (
              <span key={w.name} title={w.name} className="animate-glow" style={{ textShadow: `0 0 10px ${w.color}` }}>
                {w.icon}
              </span>
            ))}
          </div>
          <h1 className="text-shimmer font-display text-5xl font-black mb-2 tracking-wider">
            7 WONDERS
          </h1>
          <p className="text-ancient-sand font-body text-sm tracking-[0.3em] uppercase opacity-70">
            Construis ta civilisation
          </p>
          <div className="gold-divider mt-4" />
        </div>

        {/* Formulaire */}
        <div className="panel-gold p-6">
          {/* Tabs */}
          <div className="flex mb-6 bg-black/30 rounded-lg p-1 gap-1">
            {[
              { id: 'create', label: '⚔️ Créer une partie' },
              { id: 'join', label: '🤝 Rejoindre' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-body font-semibold transition-all ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-gold-600 to-gold-700 text-ancient-dark shadow-lg'
                    : 'text-ancient-sand hover:text-gold-400'
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
            <div>
              <label className="block text-xs font-body text-ancient-sand mb-1 uppercase tracking-widest">
                Ton nom de civilisation
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Ex: Pharaon, Alexandre..."
                maxLength={20}
                className="w-full px-4 py-3 bg-black/40 border border-gold-700/40 rounded-lg text-parchment font-body text-sm
                  placeholder-ancient-stone focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30
                  transition-colors"
                style={{ color: '#f5e6c8' }}
              />
            </div>

            {tab === 'join' && (
              <div>
                <label className="block text-xs font-body text-ancient-sand mb-1 uppercase tracking-widest">
                  Code de la partie
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: AB12CD"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-black/40 border border-gold-700/40 rounded-lg text-gold-300 font-display
                    text-xl text-center tracking-[0.5em] placeholder-ancient-stone
                    focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            )}

            <button type="submit" disabled={loading || !username.trim() || (tab === 'join' && !code.trim())}
              className="btn-gold w-full py-3 rounded-lg font-display text-sm tracking-widest">
              {loading ? '⌛ Connexion...' : tab === 'create' ? '🏛️ CRÉER LA PARTIE' : '⚔️ REJOINDRE'}
            </button>
          </form>

          <div className="gold-divider" />
          <div className="text-center">
            <p className="text-ancient-stone text-xs font-body">
              3 à 6 joueurs • 3 âges • Système de draft
            </p>
          </div>
        </div>

        {/* Légende des types de cartes */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { type: 'resource', label: 'Ressources', icon: '🪵', color: '#5D4037' },
            { type: 'civil', label: 'Civil', icon: '⛩️', color: '#1565C0' },
            { type: 'military', label: 'Militaire', icon: '⚔️', color: '#B71C1C' },
            { type: 'science', label: 'Science', icon: '🔭', color: '#1B5E20' },
            { type: 'commerce', label: 'Commerce', icon: '💰', color: '#E65100' },
            { type: 'guild', label: 'Guildes', icon: '👑', color: '#4A148C' },
          ].map(t => (
            <div key={t.type} className="flex items-center gap-2 px-3 py-2 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
              style={{ background: t.color + '33', border: `1px solid ${t.color}66` }}>
              <span className="text-base">{t.icon}</span>
              <span className="text-xs font-body" style={{ color: '#f5e6c8' }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
