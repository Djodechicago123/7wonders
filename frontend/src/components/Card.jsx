// Card.jsx - Carte avec vrais SVG générés
import { useGameStore } from '../lib/store';

const cardSvgModules = import.meta.glob('../assets/cards/*.svg', { as: 'url', eager: true });

function getCardSvgUrl(cardId) {
  return cardSvgModules[`../assets/cards/card-${cardId}.svg`] || null;
}

export function getWonderSvgUrl(wonderId) {
  return cardSvgModules[`../assets/cards/wonder-${wonderId}.svg`] || null;
}

const CARD_BACK_URL = cardSvgModules['../assets/cards/card-back.svg'];

export const RESOURCE_ICONS = {
  wood:    { icon: '🪵', color: '#8B4513', label: 'Bois' },
  clay:    { icon: '🧱', color: '#D2691E', label: 'Argile' },
  ore:     { icon: '⚙️', color: '#607D8B', label: 'Minerai' },
  stone:   { icon: '🪨', color: '#78909C', label: 'Pierre' },
  papyrus: { icon: '📜', color: '#9E8B5E', label: 'Papyrus' },
  glass:   { icon: '🔮', color: '#26C6DA', label: 'Verre' },
  textile: { icon: '🧵', color: '#AB47BC', label: 'Tissu' },
  coin:    { icon: '🪙', color: '#FFD700', label: 'Pièce' },
};

export const TYPE_CONFIG = {
  resource:  { color: '#5D4037', border: '#8D6E63', label: 'Ressource', bg: 'linear-gradient(160deg, #6D4C41, #3E2723)' },
  civil:     { color: '#1565C0', border: '#42A5F5', label: 'Civil',     bg: 'linear-gradient(160deg, #1976D2, #0D47A1)' },
  military:  { color: '#B71C1C', border: '#EF9A9A', label: 'Militaire', bg: 'linear-gradient(160deg, #C62828, #7B1D1D)' },
  science:   { color: '#1B5E20', border: '#81C784', label: 'Science',   bg: 'linear-gradient(160deg, #2E7D32, #1B5E20)' },
  commerce:  { color: '#E65100', border: '#FFCC02', label: 'Commerce',  bg: 'linear-gradient(160deg, #F57C00, #E65100)' },
  guild:     { color: '#4A148C', border: '#CE93D8', label: 'Guilde',    bg: 'linear-gradient(160deg, #6A1B9A, #4A148C)' },
};

export function CostBadge({ cost }) {
  if (!cost || cost.length === 0) return <span className="text-green-400 text-xs font-body">Gratuit</span>;
  const items = [];
  (Array.isArray(cost) ? cost : [cost]).forEach(c =>
    Object.entries(c).forEach(([res, amt]) => {
      const r = RESOURCE_ICONS[res];
      if (r) items.push({ ...r, res, amt });
    })
  );
  return (
    <div className="flex flex-wrap gap-1">
      {items.map(({ icon, color, res, amt }) => (
        <div key={res} className="flex items-center gap-0.5 text-xs font-body font-bold rounded px-1"
          style={{ background: color + '33', color, border: `1px solid ${color}66` }}>
          <span>{icon}</span>{amt > 1 && <span>{amt}</span>}
        </div>
      ))}
    </div>
  );
}

export function EffectBadge({ effect }) {
  if (!effect) return null;
  const items = [];
  if (effect.resources) Object.entries(effect.resources).forEach(([res, amt]) => {
    const r = RESOURCE_ICONS[res];
    if (r) items.push({ icon: r.icon, label: `+${amt} ${r.label}`, color: r.color });
    else if (res === 'any') items.push({ icon: '✨', label: 'Au choix', color: '#FFD700' });
  });
  if (effect.vp)      items.push({ icon: '🏆', label: `+${effect.vp} VP`, color: '#FFD700' });
  if (effect.coins)   items.push({ icon: '🪙', label: `+${effect.coins}`, color: '#FFD700' });
  if (effect.shields) items.push({ icon: '⚔️', label: `+${effect.shields}`, color: '#EF5350' });
  if (effect.science) {
    const s = { compass: '🧭', tablet: '📋', gear: '⚙️', any: '🔬' };
    items.push({ icon: s[effect.science] || '🔬', label: 'Science', color: '#66BB6A' });
  }
  if (effect.tradeLeft || effect.tradeRight) items.push({ icon: '🤝', label: 'Commerce', color: '#FFA726' });
  if (effect.freeBuild) items.push({ icon: '🆓', label: 'Gratuit', color: '#42A5F5' });
  return (
    <div className="flex flex-wrap gap-1">
      {items.slice(0, 3).map((item, i) => (
        <span key={i} className="text-xs font-body font-semibold px-1 py-0.5 rounded"
          style={{ background: (item.color||'#FFD700')+'22', color: item.color||'#FFD700', border:`1px solid ${item.color||'#FFD700'}44` }}>
          {item.icon} {item.label}
        </span>
      ))}
    </div>
  );
}

export default function Card({ card, size = 'normal', interactive = true, showBack = false }) {
  const { selectedCard, selectCard } = useGameStore();
  if (!card) return null;
  const sizes = { small: { w:60, h:85 }, normal: { w:85, h:120 }, large: { w:120, h:170 } };
  const { w, h } = sizes[size] || sizes.normal;
  const isSelected = selectedCard && (selectedCard.uniqueId === card.uniqueId || selectedCard.id === card.id);

  if (showBack || card.hidden) {
    return (
      <div style={{ width:w, height:h, flexShrink:0, borderRadius:8, overflow:'hidden', border: '2px solid #3d2b1f' }}>
        {CARD_BACK_URL
          ? <img src={CARD_BACK_URL} alt="Dos" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
          : <div style={{ width:w, height:h, background:'#1a0f08', display:'flex', alignItems:'center', justifyContent:'center', opacity:0.4 }}>🏛️</div>
        }
      </div>
    );
  }

  const svgUrl = getCardSvgUrl(card.uniqueId || card.id);
  const cfg = TYPE_CONFIG[card.type] || TYPE_CONFIG.resource;

  return (
    <div
      className={`card ${isSelected ? 'selected' : ''}`}
      onClick={() => interactive && selectCard(card)}
      title={card.name}
      style={{
        width:w, height:h, flexShrink:0,
        cursor: interactive ? 'pointer' : 'default',
        borderRadius:8, overflow:'hidden', padding:0,
        border: isSelected ? '2px solid #fde047' : svgUrl ? '2px solid transparent' : `2px solid ${cfg.border}88`,
        background: svgUrl ? 'transparent' : cfg.bg,
        userSelect:'none',
      }}
    >
      {svgUrl ? (
        <img src={svgUrl} alt={card.name} style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} draggable={false} />
      ) : (
        <div style={{ padding: size==='small'?4:6, display:'flex', flexDirection:'column', height:'100%' }}>
          <span style={{ fontSize: size==='small'?'1rem':'1.4rem', marginBottom:2 }}>{card.icon||'🏛️'}</span>
          <p style={{ color:'#f5e6c8', fontSize: size==='small'?'0.45rem':'0.55rem', fontWeight:600, lineHeight:1.2 }}>{card.name}</p>
          {size!=='small' && (
            <span style={{ background:cfg.color+'44', color:cfg.border, fontSize:'0.45rem', padding:'1px 4px', borderRadius:3, display:'inline-block', marginTop:2 }}>{cfg.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
