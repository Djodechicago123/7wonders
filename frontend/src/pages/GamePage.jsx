// GamePage.jsx - Page principale de jeu
import { useGameStore } from '../lib/store';
import Card from '../components/Card';
import WonderBoard from '../components/WonderBoard';
import ActionPanel from '../components/ActionPanel';
import Chat from '../components/Chat';
import { useState } from 'react';

function HandFan({ cards }) {
  const { selectedCard } = useGameStore();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!cards || cards.length === 0) {
    return (
      <p className="text-ancient-stone font-body text-sm py-6 text-center w-full">
        ⏳ En attente du prochain tour...
      </p>
    );
  }

  const count = cards.length;
  const maxAngle = count > 1 ? Math.min(28, count * 3.5) : 0;
  const spacing = Math.min(36, 220 / count);

  return (
    <div className="relative flex justify-center overflow-visible" style={{ height: 158 }}>
      {cards.map((card, i) => {
        const angle = count > 1 ? -maxAngle / 2 + (maxAngle / (count - 1)) * i : 0;
        const isHovered = hoveredIdx === i;
        const isSelected = selectedCard && (
          selectedCard.uniqueId === card.uniqueId || selectedCard.id === card.id
        );
        const lift = isHovered || isSelected ? -28 : 0;

        return (
          <div
            key={card.uniqueId || card.id || i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              position: 'absolute',
              left: `calc(50% + ${(i - (count - 1) / 2) * spacing}px - 42px)`,
              bottom: 4,
              transformOrigin: 'bottom center',
              transform: `rotate(${angle}deg) translateY(${lift}px)`,
              transition: 'transform 0.15s ease',
              zIndex: isHovered || isSelected ? 100 : i,
            }}
          >
            <Card card={card} size="normal" interactive={true} />
          </div>
        );
      })}
    </div>
  );
}

const AGE_NAMES = { 1: 'Âge I — L\'Antiquité', 2: 'Âge II — La Croissance', 3: 'Âge III — L\'Empire' };
const AGE_ICONS = { 1: '🌅', 2: '🌄', 3: '🌇' };

export default function GamePage() {
  const { game, myPlayer, userId, notification, error, clearError, returnToHome } = useGameStore();
  const [showChat, setShowChat] = useState(false);
  const [selectedNeighbor, setSelectedNeighbor] = useState(null);

  if (!game || !myPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⚙️</div>
          <p className="font-display text-gold-400">Chargement de la partie...</p>
        </div>
      </div>
    );
  }

  const playerIndex = game.players.findIndex(p => p.userId === userId);
  const n = game.players.length;
  const leftNeighbor = game.players[(playerIndex - 1 + n) % n];
  const rightNeighbor = game.players[(playerIndex + 1) % n];
  const otherPlayers = game.players.filter(p => p.userId !== userId && p.userId !== leftNeighbor?.userId && p.userId !== rightNeighbor?.userId);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at top, #1e120a 0%, #1a1208 100%)' }}>

      {/* ── NOTIFICATION ─────────────────────── */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 panel-gold px-6 py-3 rounded-xl animate-float-in">
          <p className="font-body text-gold-300 text-sm">{notification}</p>
        </div>
      )}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl animate-float-in"
          style={{ background: '#7B1D1D', border: '1px solid #EF5350' }}>
          <div className="flex items-center gap-2">
            <p className="font-body text-red-200 text-sm">⚠️ {error}</p>
            <button onClick={clearError} className="text-red-400 hover:text-red-200">✕</button>
          </div>
        </div>
      )}

      {/* ── HEADER ────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gold-800/30"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{AGE_ICONS[game.age] || '🏛️'}</span>
          <div>
            <p className="font-display font-bold text-gold-400 text-sm">{AGE_NAMES[game.age] || 'Fin de partie'}</p>
            <p className="font-body text-ancient-stone text-xs">Tour {game.turn} • {game.players.length} joueurs</p>
          </div>
        </div>

        {/* Progression des âges */}
        <div className="hidden md:flex items-center gap-1">
          {[1, 2, 3].map(age => (
            <div key={age} className="flex items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold transition-all ${
                age < game.age ? 'bg-gold-600 text-ancient-dark' :
                age === game.age ? 'bg-gold-400 text-ancient-dark animate-glow' :
                'bg-ancient-brown/50 text-ancient-stone'
              }`}>
                {age < game.age ? '✓' : age}
              </div>
              {age < 3 && <div className="w-4 h-0.5" style={{ background: age < game.age ? '#D4AC0D' : '#3d2b1f' }} />}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowChat(v => !v)}
            className="btn-ghost text-xs px-3 py-1 rounded-lg">
            💬
          </button>
          <button onClick={returnToHome}
            className="btn-ghost text-xs px-3 py-1 rounded-lg text-red-400 border-red-800/40 hover:border-red-500">
            ✕
          </button>
        </div>
      </header>

      {/* ── CORPS PRINCIPAL ───────────────────── */}
      <div className="flex flex-1 overflow-hidden gap-2 p-2">

        {/* ── COLONNE GAUCHE: Voisin gauche ─── */}
        <div className="hidden lg:flex flex-col w-52 gap-2 flex-shrink-0">
          <NeighborPanel player={leftNeighbor} side="gauche" />
          {otherPlayers.slice(0, 2).map(p => (
            <NeighborPanel key={p.userId} player={p} side="autre" compact />
          ))}
        </div>

        {/* ── CENTRE: Mon plateau + Main ──────── */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">

          {/* Mon plateau */}
          <div className="flex-shrink-0">
            <WonderBoard player={myPlayer} />
          </div>

          {/* Log des dernières actions */}
          {game.log && game.log.length > 0 && (
            <div className="panel px-3 py-2 flex-shrink-0">
              <div className="flex gap-3 overflow-x-auto custom-scroll">
                {game.log.slice(-5).reverse().map((entry, i) => (
                  <span key={i} className="text-xs font-body text-ancient-sand whitespace-nowrap opacity-70 hover:opacity-100 transition-opacity">
                    {i === 0 ? '▶ ' : '• '}{entry}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── MA MAIN (éventail) ── */}
          <div className="panel p-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-display text-gold-400 text-xs tracking-widest">
                🎴 MA MAIN ({myPlayer.hand?.length || 0} cartes)
              </p>
              <p className="text-xs font-body text-ancient-stone">
                {game.age === 2 ? '← Tourne à gauche' : '→ Tourne à droite'}
              </p>
            </div>
            <HandFan cards={myPlayer.hand} />
          </div>

          {/* ── PANEL D'ACTION ── */}
          <div className="flex-1">
            <ActionPanel />
          </div>
        </div>

        {/* ── COLONNE DROITE: Voisin droit + Chat ── */}
        <div className="hidden lg:flex flex-col w-52 gap-2 flex-shrink-0">
          <NeighborPanel player={rightNeighbor} side="droite" />
          {otherPlayers.slice(2).map(p => (
            <NeighborPanel key={p.userId} player={p} side="autre" compact />
          ))}
          {showChat && <Chat onToggle={() => setShowChat(false)} />}
          {!showChat && (
            <button onClick={() => setShowChat(true)}
              className="panel p-2 text-xs font-body text-ancient-sand hover:text-gold-400 transition-colors rounded-xl text-center">
              💬 Ouvrir le chat
            </button>
          )}
        </div>
      </div>

      {/* ── MOBILE: voisins en bas ─────────────── */}
      <div className="lg:hidden flex gap-2 p-2 border-t border-gold-800/20 overflow-x-auto custom-scroll">
        <NeighborPanel player={leftNeighbor} side="gauche" compact />
        <NeighborPanel player={rightNeighbor} side="droite" compact />
        {otherPlayers.map(p => (
          <NeighborPanel key={p.userId} player={p} side="autre" compact />
        ))}
      </div>
    </div>
  );
}

// Panneau d'un voisin
function NeighborPanel({ player, side, compact = false }) {
  if (!player) return null;

  const sideColors = { gauche: '#42A5F5', droite: '#EF5350', autre: '#9E9E9E' };
  const color = sideColors[side] || '#9E9E9E';
  const sideLabel = side === 'gauche' ? '← Voisin gauche' : side === 'droite' ? 'Voisin droit →' : 'Joueur';

  if (compact) {
    return (
      <div className="panel rounded-xl p-2 flex-shrink-0" style={{ minWidth: 140, borderColor: color + '44' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{player.wonder?.icon}</span>
          <div className="min-w-0">
            <p className="text-xs font-body font-bold truncate" style={{ color }}>{player.username}</p>
            <p className="text-xs font-body text-ancient-stone truncate">{sideLabel}</p>
          </div>
        </div>
        <div className="flex gap-2 text-xs font-body text-ancient-sand">
          <span>🪙{player.coins}</span>
          <span>⚔️{player.shields}</span>
          <span>🏆{player.vp}</span>
          <span>🃏{player.builtCards?.length || 0}</span>
        </div>
        {/* Cartes cachées */}
        <div className="flex gap-0.5 mt-1 overflow-hidden">
          {[...(player.hand || [])].slice(0, 7).map((_, i) => (
            <div key={i} className="rounded flex-shrink-0"
              style={{ width: 8, height: 12, background: color + '44', border: `1px solid ${color}66` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="panel rounded-xl p-3 flex flex-col gap-2" style={{ borderColor: color + '44' }}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{player.wonder?.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-body font-bold truncate" style={{ color }}>{player.username}</p>
          <p className="text-xs font-body text-ancient-stone">{sideLabel}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-1 text-xs font-body">
        <div className="flex items-center gap-1">
          <span>🪙</span><span className="text-ancient-sand">{player.coins} pièces</span>
        </div>
        <div className="flex items-center gap-1">
          <span>⚔️</span><span className="text-ancient-sand">{player.shields} boucliers</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🏆</span><span className="text-ancient-sand">{player.vp} VP</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🃏</span><span className="text-ancient-sand">{player.builtCards?.length || 0} cartes</span>
        </div>
      </div>

      {/* Science */}
      {player.science && (player.science.compass + player.science.tablet + player.science.gear > 0) && (
        <div className="flex gap-1 text-xs">
          {player.science.compass > 0 && <span className="bg-green-900/40 text-green-400 px-1 rounded">🧭×{player.science.compass}</span>}
          {player.science.tablet > 0 && <span className="bg-green-900/40 text-green-400 px-1 rounded">📋×{player.science.tablet}</span>}
          {player.science.gear > 0 && <span className="bg-green-900/40 text-green-400 px-1 rounded">⚙️×{player.science.gear}</span>}
        </div>
      )}

      {/* Merveille */}
      <div>
        <p className="text-xs font-body text-ancient-stone mb-1">{player.wonder?.name} — Étapes</p>
        <div className="flex gap-1">
          {player.wonder?.stages?.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-sm"
              style={{ background: i < player.wonderStagesBuilt ? color : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
      </div>

      {/* Dos de cartes en main */}
      <div>
        <p className="text-xs font-body text-ancient-stone mb-1">Main ({player.hand?.length || 0} cartes)</p>
        <div className="flex gap-0.5">
          {[...(player.hand || [])].map((_, i) => (
            <div key={i} className="rounded-sm flex-shrink-0"
              style={{ width: 10, height: 14, background: color + '33', border: `1px solid ${color}55` }} />
          ))}
        </div>
      </div>

      {/* Dernières cartes jouées */}
      {player.builtCards && player.builtCards.length > 0 && (
        <div>
          <p className="text-xs font-body text-ancient-stone mb-1">Dernières constructions</p>
          <div className="flex flex-wrap gap-1">
            {player.builtCards.slice(-4).map((card, i) => (
              <span key={i} className="text-sm" title={card.name}>{card.icon}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
