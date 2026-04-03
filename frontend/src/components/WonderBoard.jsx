// WonderBoard.jsx - Plateau d'une merveille avec planche SVG
import Card, { RESOURCE_ICONS, TYPE_CONFIG } from './Card';

const boardSvgs = import.meta.glob('../assets/cards/wonder-board-*.svg', { as: 'url', eager: true });

function getBoardUrl(boardFile) {
  return boardSvgs[`../assets/cards/${boardFile}.svg`] || null;
}

export default function WonderBoard({ player, compact = false }) {
  if (!player) return null;
  const { wonder, wonderStagesBuilt, resources, coins, shields, science, builtCards, vp } = player;
  const accent = wonder?.accentColor || '#D4AC0D';
  const boardUrl = getBoardUrl(wonder?.boardFile);

  // ── MODE COMPACT (voisins) ───────────────────────────────────
  if (compact) {
    return (
      <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: `1px solid ${accent}55` }}>
        {boardUrl
          ? <img src={boardUrl} alt={wonder?.name}
              style={{ width: '100%', height: 80, objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
          : <div style={{ width: '100%', height: 80, background: '#1a0f08', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              {wonder?.icon}
            </div>
        }
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.15) 100%)',
          padding: '6px 10px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          {/* Nom + stats */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-black text-xs leading-tight" style={{ color: accent }}>{wonder?.name}</p>
              <p className="font-body text-xs opacity-70 text-ancient-sand leading-tight">{player.username}</p>
            </div>
            <div className="flex gap-2 text-xs font-body text-ancient-sand">
              <span>🪙{coins}</span>
              <span>⚔️{shields}</span>
              <span>🏆{vp}</span>
            </div>
          </div>
          {/* Barre d'étapes */}
          <div className="flex gap-1">
            {wonder?.stages.map((_, i) => (
              <div key={i} className="flex-1 rounded-sm"
                style={{ height: 5, background: i < wonderStagesBuilt ? accent : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── MODE NORMAL (plateau du joueur courant) ──────────────────
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: `2px solid ${accent}88` }}>

      {/* ── Bannière SVG ── */}
      <div style={{ position: 'relative' }}>
        {boardUrl
          ? <img src={boardUrl} alt={wonder?.name}
              style={{ width: '100%', height: 200, objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
          : <div style={{ width: '100%', height: 200, background: '#1a0f08', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
              {wonder?.icon}
            </div>
        }
        {/* Overlay gradient sur la bannière */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.75) 100%)',
          padding: '12px 14px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          {/* Haut : titre */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display font-black text-xl leading-tight" style={{ color: accent, textShadow: `0 0 12px ${accent}88` }}>
                {wonder?.name}
              </h2>
              <p className="font-body text-xs text-ancient-sand opacity-80">{wonder?.subtitle} · {wonder?.region}</p>
              <p className="font-body text-xs text-ancient-stone opacity-60 mt-0.5">{player.username}</p>
            </div>
            <div className="text-right">
              <p className="font-display font-black text-2xl text-gold-400" style={{ textShadow: '0 0 10px rgba(212,172,13,0.6)' }}>
                {vp + Math.floor(coins / 3)}
              </p>
              <p className="text-xs font-body text-ancient-stone">VP total</p>
            </div>
          </div>

          {/* Bas : stats rapides */}
          <div className="flex items-center gap-3">
            <StatPill icon="🪙" value={coins} color="#FFD700" />
            <StatPill icon="⚔️" value={shields} color="#EF5350" />
            <StatPill icon="🏆" value={vp} color="#FFD700" />
            <StatPill icon="🃏" value={builtCards.length} color="#42A5F5" />
            {/* Ressource de départ */}
            {Object.entries(wonder?.startResource || {}).map(([res]) => {
              const r = RESOURCE_ICONS[res];
              return r ? <span key={res} className="text-base ml-1" title={`Ressource de départ: ${r.label}`}>{r.icon}</span> : null;
            })}
          </div>
        </div>
      </div>

      {/* ── Contenu sous la bannière ── */}
      <div style={{ background: 'linear-gradient(135deg, #1a0f08 0%, #120a05 100%)', padding: '12px 14px' }}>

        {/* Science */}
        {(science.compass > 0 || science.tablet > 0 || science.gear > 0) && (
          <div className="flex gap-2 mb-3">
            {science.compass > 0 && <SciChip symbol="🧭" count={science.compass} />}
            {science.tablet > 0 && <SciChip symbol="📋" count={science.tablet} />}
            {science.gear > 0 && <SciChip symbol="⚙️" count={science.gear} />}
          </div>
        )}

        {/* Ressources produites */}
        {Object.entries(resources).some(([, v]) => v > 0) && (
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
        )}

        {/* Étapes Merveille */}
        <div className="mb-3">
          <p className="text-xs font-body text-ancient-sand uppercase tracking-widest mb-2 opacity-60">Merveille</p>
          <div className="flex gap-2">
            {wonder?.stages.map((stage, i) => {
              const built = i < wonderStagesBuilt;
              return (
                <div key={i} className="flex-1 rounded-lg p-2 transition-all flex flex-col min-h-[90px]"
                  style={{
                    background: built ? accent + '22' : 'rgba(0,0,0,0.35)',
                    border: `1px solid ${built ? accent : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: built ? `0 0 8px ${accent}44` : 'none',
                  }}>
                  <div className="text-center mb-1">
                    <span className="text-xs font-display font-bold" style={{ color: built ? accent : '#666' }}>
                      {built ? '✅' : `Étape ${i + 1}`}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
                    {stage.effect && renderStageEffect(stage.effect, true)}
                  </div>
                  <div className="flex flex-wrap gap-0.5 justify-center mt-1 pt-1"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    {Object.entries(stage.cost || {}).map(([res, amt]) => {
                      const r = RESOURCE_ICONS[res];
                      if (!r) return null;
                      return (
                        <span key={res} className="text-xs" title={`${r.label} ×${amt}`} style={{ color: r.color }}>
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
            <p className="text-xs font-body text-ancient-sand uppercase tracking-widest mb-2 opacity-60">
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
      {effect.science === 'compass' ? '🧭' : effect.science === 'tablet' ? '📋' : effect.science === 'gear' ? '⚙️' : '🔬'}
    </span>
  );
  if (effect.resources) {
    Object.entries(effect.resources).forEach(([res, amt]) => {
      if (res === 'any') parts.push(<span key="any" className={`${sz} text-purple-300`}>🔀</span>);
      else {
        const r = RESOURCE_ICONS[res];
        if (r) parts.push(<span key={res} className={sz} style={{ color: r.color }}>{r.icon}{amt > 1 ? amt : ''}</span>);
      }
    });
  }
  if (effect.freeBuild) parts.push(<span key="free" className={`${big ? 'text-base' : 'text-xs'} text-blue-300`}>🆓</span>);
  if (effect.discardBuild) parts.push(<span key="discard" className={`${big ? 'text-base' : 'text-xs'} text-purple-300`}>♻️</span>);
  return parts;
}

function StatPill({ icon, value, color }) {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
      style={{ background: color + '22', border: `1px solid ${color}44` }}>
      <span className="text-xs">{icon}</span>
      <span className="font-display font-bold text-xs" style={{ color }}>{value}</span>
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
