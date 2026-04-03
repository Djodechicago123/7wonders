// WonderBoard.jsx - Plateau d'une merveille
import Card, { RESOURCE_ICONS, TYPE_CONFIG } from './Card';

const WONDER_COLORS = {
  Rhodes: { bg: '#4a1010', accent: '#EF5350' },
  Alexandrie: { bg: '#0d2744', accent: '#42A5F5' },
  'Ephèse': { bg: '#4a3900', accent: '#FFA726' },
  Babylone: { bg: '#3a1a00', accent: '#FF7043' },
  Olympie: { bg: '#0d3318', accent: '#66BB6A' },
  Halicarnasse: { bg: '#2d0d4a', accent: '#CE93D8' },
  Gizeh: { bg: '#4a3a00', accent: '#FFD700' },
};

export default function WonderBoard({ player, compact = false }) {
  if (!player) return null;
  const { wonder, wonderStagesBuilt, resources, coins, shields, science, builtCards, vp } = player;
  const wColors = WONDER_COLORS[wonder?.name] || { bg: '#2c1810', accent: '#D4AC0D' };

  const cardsByType = builtCards.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1;
    return acc;
  }, {});

  if (compact) {
    return (
      <div className="panel p-3 rounded-xl" style={{ background: wColors.bg + 'cc', borderColor: wColors.accent + '66' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{wonder?.icon}</span>
          <div>
            <p className="text-xs font-display font-bold" style={{ color: wColors.accent }}>{wonder?.name}</p>
            <p className="text-xs font-body text-ancient-sand opacity-70">{player.username}</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-xs font-body text-ancient-sand">🪙{coins}</span>
            <span className="text-xs font-body text-ancient-sand">⚔️{shields}</span>
          </div>
        </div>
        {/* Étapes merveille */}
        <div className="flex gap-1">
          {wonder?.stages.map((stage, i) => (
            <div key={i} className="flex-1 h-2 rounded-sm"
              style={{ background: i < wonderStagesBuilt ? wColors.accent : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="wonder-board p-4" style={{ background: `linear-gradient(135deg, ${wColors.bg} 0%, #1a0f08 100%)`, borderColor: wColors.accent }}>
      {/* Nom de la merveille */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl" style={{ textShadow: `0 0 15px ${wColors.accent}` }}>{wonder?.icon}</span>
          <div>
            <h2 className="font-display font-black text-lg" style={{ color: wColors.accent }}>
              {wonder?.name}
            </h2>
            <p className="text-xs font-body text-ancient-sand opacity-70">{player.username}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-gold-400 text-xl">{vp + Math.floor(coins / 3)} VP</p>
          <p className="text-xs font-body text-ancient-stone">dont {Math.floor(coins / 3)} via 💰</p>
        </div>
      </div>

      <div className="gold-divider" />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 my-3">
        <StatBlock label="💰 Pièces" value={coins} color="#FFD700" />
        <StatBlock label="⚔️ Boucliers" value={shields} color="#EF5350" />
        <StatBlock label="🏆 Points" value={vp} color="#FFD700" />
        <StatBlock label="🃏 Cartes" value={builtCards.length} color="#42A5F5" />
      </div>

      {/* Science */}
      {(science.compass > 0 || science.tablet > 0 || science.gear > 0) && (
        <div className="flex gap-2 mb-3">
          {science.compass > 0 && <SciChip symbol="🧭" count={science.compass} />}
          {science.tablet > 0 && <SciChip symbol="📋" count={science.tablet} />}
          {science.gear > 0 && <SciChip symbol="⚙️" count={science.gear} />}
        </div>
      )}

      {/* Ressources */}
      <div className="flex flex-wrap gap-1 mb-3">
        {Object.entries(resources).filter(([, v]) => v > 0).map(([res, amt]) => {
          const r = RESOURCE_ICONS[res];
          if (!r) return null;
          return (
            <div key={res} className="resource-badge"
              style={{ background: r.color + '33', border: `1.5px solid ${r.color}`, color: '#f5e6c8' }}>
              <span title={`${r.label} ×${amt}`}>{r.icon}{amt > 1 ? amt : ''}</span>
            </div>
          );
        })}
      </div>

      {/* Étapes Merveille */}
      <div className="mb-3">
        <p className="text-xs font-body text-ancient-sand uppercase tracking-widest mb-2 opacity-70">Merveille</p>
        <div className="flex gap-2">
          {wonder?.stages.map((stage, i) => {
            const built = i < wonderStagesBuilt;
            return (
              <div key={i} className="flex-1 rounded-lg p-2 transition-all flex flex-col min-h-[90px]"
                style={{
                  background: built ? wColors.accent + '22' : 'rgba(0,0,0,0.3)',
                  border: `1px solid ${built ? wColors.accent : 'rgba(255,255,255,0.1)'}`,
                }}>
                {/* Status */}
                <div className="text-center mb-1">
                  <span className="text-xs font-display font-bold" style={{ color: built ? wColors.accent : '#888' }}>
                    {built ? '✅' : `Étape ${i + 1}`}
                  </span>
                </div>
                {/* Récompense — grande, centrée */}
                <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
                  {stage.effect && renderStageEffect(stage.effect, true)}
                </div>
                {/* Coût — petit, en bas */}
                <div className="flex flex-wrap gap-0.5 justify-center mt-1 pt-1"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  {Object.entries(stage.cost || {}).map(([res, amt]) => {
                    const r = RESOURCE_ICONS[res];
                    if (!r) return null;
                    return (
                      <span key={res} className="text-xs" title={`${r.label} ×${amt}`}
                        style={{ color: r.color }}>
                        {r.icon}{amt > 1 ? amt : ''}
                      </span>
                    );
                  })}
                  {(!stage.cost || Object.keys(stage.cost).length === 0) && (
                    <span className="text-xs text-green-400">🆓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cartes construites — faces visibles */}
      {builtCards.length > 0 && (
        <div>
          <p className="text-xs font-body text-ancient-sand uppercase tracking-widest mb-2 opacity-70">
            Constructions ({builtCards.length})
          </p>
          {['resource', 'commerce', 'military', 'civil', 'science', 'guild'].map(type => {
            const group = builtCards.filter(c => c.type === type);
            if (group.length === 0) return null;
            const cfg = TYPE_CONFIG[type];
            return (
              <div key={type} className="mb-2">
                <p className="text-xs font-body mb-1 opacity-60" style={{ color: cfg?.border || '#f5e6c8' }}>
                  {cfg?.label || type} ×{group.length}
                </p>
                <div className="flex flex-wrap gap-1">
                  {group.map((card, i) => (
                    <Card key={card.uniqueId || card.id || i} card={card} size="small" interactive={false} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function renderStageEffect(effect, big = false) {
  const sz = big ? 'text-xl font-bold' : 'text-xs';
  const parts = [];
  if (effect.vp) parts.push(
    <span key="vp" className={`${sz} text-yellow-400 flex items-center gap-0.5`}>⭐<span>{effect.vp}</span></span>
  );
  if (effect.coins) parts.push(
    <span key="coins" className={`${sz} text-yellow-300 flex items-center gap-0.5`}>🪙<span>{effect.coins}</span></span>
  );
  if (effect.shields) parts.push(
    <span key="shields" className={`${sz} text-red-400 flex items-center gap-0.5`}>🛡<span>{effect.shields}</span></span>
  );
  if (effect.science) parts.push(
    <span key="science" className={`${sz} text-green-400`}>
      {effect.science === 'compass' ? '🧭' : effect.science === 'tablet' ? '📋' : effect.science === 'gear' ? '⚙️' : '❓'}
    </span>
  );
  if (effect.resources) {
    Object.entries(effect.resources).forEach(([res, amt]) => {
      if (res === 'any') parts.push(<span key="any" className={`${sz} text-purple-300`}>🔀</span>);
      else {
        const r = RESOURCE_ICONS[res];
        if (r) parts.push(
          <span key={res} className={sz} style={{ color: r.color }}>{r.icon}{amt > 1 ? amt : ''}</span>
        );
      }
    });
  }
  if (effect.freeBuild) parts.push(<span key="free" className={`${big ? 'text-base' : 'text-xs'} text-blue-300`}>🆓</span>);
  if (effect.discardBuild) parts.push(<span key="discard" className={`${big ? 'text-base' : 'text-xs'} text-purple-300`}>♻️</span>);
  return parts;
}

function StatBlock({ label, value, color }) {
  return (
    <div className="text-center p-2 rounded-lg" style={{ background: color + '11', border: `1px solid ${color}33` }}>
      <p className="font-display font-black text-lg" style={{ color }}>{value}</p>
      <p className="text-xs font-body text-ancient-stone">{label}</p>
    </div>
  );
}

function SciChip({ symbol, count }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-900/40 border border-green-600/40">
      <span className="text-sm">{symbol}</span>
      <span className="text-xs font-display font-bold text-green-400">×{count}</span>
    </div>
  );
}
