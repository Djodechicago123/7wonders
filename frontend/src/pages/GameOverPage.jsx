// GameOverPage.jsx - Écran de fin de partie
import { useState } from 'react';
import { useGameStore } from '../lib/store';

const MEDAL = ['🥇', '🥈', '🥉'];

const RESOURCE_ICONS = {
  wood:    { icon: '🪵', color: '#8B4513', label: 'Bois' },
  clay:    { icon: '🧱', color: '#D2691E', label: 'Argile' },
  ore:     { icon: '⚙️', color: '#607D8B', label: 'Minerai' },
  stone:   { icon: '🪨', color: '#78909C', label: 'Pierre' },
  papyrus: { icon: '📜', color: '#9E8B5E', label: 'Papyrus' },
  glass:   { icon: '🔮', color: '#26C6DA', label: 'Verre' },
  textile: { icon: '🧵', color: '#AB47BC', label: 'Tissu' },
};

export default function GameOverPage() {
  const { finalScores, returnToHome, username } = useGameStore();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at center, #2c1810 0%, #1a1208 100%)' }}>
      <div className="w-full max-w-2xl animate-float-in">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-glow">🏆</div>
          <h1 className="text-shimmer font-display text-4xl font-black mb-2">FIN DE PARTIE</h1>
          <p className="text-ancient-sand font-body text-sm tracking-widest">Que les dieux jugent vos civilisations</p>
          <div className="gold-divider mt-4" />
        </div>

        {/* Classement */}
        <div className="panel-gold p-5 mb-4">
          <h2 className="font-display text-gold-400 text-sm tracking-widest mb-4 text-center">⚔️ CLASSEMENT FINAL</h2>
          <div className="space-y-2">
            {finalScores.map((player, i) => (
              <div key={player.userId || i}>
                {/* Ligne joueur */}
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${i === 0 ? 'animate-glow' : ''}`}
                  style={{
                    background: i === 0 ? 'rgba(212,172,13,0.15)' : i === 1 ? 'rgba(180,180,180,0.1)' : i === 2 ? 'rgba(180,100,0,0.1)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${i === 0 ? 'rgba(212,172,13,0.5)' : i === 1 ? 'rgba(180,180,180,0.3)' : i === 2 ? 'rgba(180,100,0,0.3)' : 'transparent'}`,
                  }}
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div className="text-2xl w-8 text-center flex-shrink-0">{MEDAL[i] || `${i + 1}.`}</div>
                  <span className="text-xl">{player.wonder?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-bold truncate"
                      style={{ color: player.username === username ? '#fde047' : '#f5e6c8' }}>
                      {player.username}
                      {player.username === username && <span className="text-xs text-ancient-stone ml-2">(toi)</span>}
                    </p>
                    <p className="text-xs font-body text-ancient-stone">{player.wonder?.name}</p>
                  </div>
                  {/* Score bars */}
                  <ScoreMini player={player} />
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-display font-black text-xl" style={{ color: i === 0 ? '#fde047' : '#f5e6c8' }}>
                      {player.finalScore ?? player.vp}
                    </p>
                    <p className="text-xs font-body text-ancient-stone">pts</p>
                  </div>
                  <span className="text-ancient-stone text-xs ml-1">{expanded === i ? '▲' : '▼'}</span>
                </div>

                {/* Détail expandable */}
                {expanded === i && (
                  <div className="mt-1 mb-2 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {/* Score breakdown */}
                    <div className="grid grid-cols-4 gap-1 mb-3">
                      {[
                        { label: 'Civil', value: player.scoreBreakdown?.civil ?? player.builtCards?.filter(c => c.type === 'civil').reduce((s, c) => s + (c.effect?.vp || 0), 0) ?? 0, icon: '🏛️', color: '#42A5F5' },
                        { label: 'Militaire', value: player.scoreBreakdown?.military ?? 0, icon: '⚔️', color: '#EF5350' },
                        { label: 'Science', value: player.scoreBreakdown?.science ?? calcScience(player.science), icon: '🔬', color: '#66BB6A' },
                        { label: 'Merveille', value: player.scoreBreakdown?.wonder ?? 0, icon: '🏗️', color: '#CE93D8' },
                        { label: 'Commerce', value: player.scoreBreakdown?.commerce ?? 0, icon: '💼', color: '#FFA726' },
                        { label: 'Guildes', value: player.scoreBreakdown?.guild ?? 0, icon: '🔮', color: '#BA68C8' },
                        { label: 'Pièces', value: player.scoreBreakdown?.coins ?? Math.floor((player.coins || 0) / 3), icon: '🪙', color: '#FFD700' },
                        { label: 'TOTAL', value: player.finalScore ?? player.vp, icon: '🏆', color: '#D4AC0D' },
                      ].map(({ label, value, icon, color }) => (
                        <div key={label} className="text-center p-1.5 rounded-lg"
                          style={{ background: color + '11', border: `1px solid ${color}33` }}>
                          <span className="text-base">{icon}</span>
                          <p className="font-display font-bold text-sm" style={{ color }}>{value}</p>
                          <p className="text-xs font-body text-ancient-stone leading-tight">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Ressources */}
                    {player.resources && Object.values(player.resources).some(v => v > 0) && (
                      <div>
                        <p className="text-xs font-body text-ancient-sand opacity-60 uppercase tracking-widest mb-1">Ressources</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(player.resources).filter(([, v]) => v > 0).map(([res, amt]) => {
                            const r = RESOURCE_ICONS[res];
                            if (!r) return null;
                            return (
                              <span key={res} className="text-xs px-1.5 py-0.5 rounded font-body font-bold"
                                style={{ background: r.color + '33', color: r.color, border: `1px solid ${r.color}66` }}>
                                {r.icon} {r.label} ×{amt}
                              </span>
                            );
                          })}
                          <span className="text-xs px-1.5 py-0.5 rounded font-body font-bold"
                            style={{ background: '#FFD70033', color: '#FFD700', border: '1px solid #FFD70066' }}>
                            🪙 {player.coins}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Retour */}
        <button onClick={returnToHome}
          className="btn-gold w-full py-4 rounded-xl font-display text-base tracking-widest">
          🏠 RETOUR À L'ACCUEIL
        </button>
      </div>
    </div>
  );
}

function ScoreMini({ player }) {
  const bd = player.scoreBreakdown;
  if (!bd) return null;
  const items = [
    { value: bd.civil, color: '#42A5F5' },
    { value: bd.military, color: '#EF5350' },
    { value: bd.science, color: '#66BB6A' },
    { value: bd.wonder, color: '#CE93D8' },
    { value: bd.commerce + bd.guild, color: '#FFA726' },
    { value: bd.coins, color: '#FFD700' },
  ].filter(x => x.value > 0);
  const total = items.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="flex h-2 w-20 rounded overflow-hidden gap-px flex-shrink-0">
      {items.map((item, i) => (
        <div key={i} style={{ width: `${(item.value / total) * 100}%`, background: item.color }} title={item.value} />
      ))}
    </div>
  );
}

function calcScience(science) {
  if (!science) return 0;
  const { compass = 0, tablet = 0, gear = 0 } = science;
  return Math.min(compass, tablet, gear) * 7 + compass * compass + tablet * tablet + gear * gear;
}
