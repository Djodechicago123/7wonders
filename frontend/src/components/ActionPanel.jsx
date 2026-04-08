// ActionPanel.jsx - Panneau d'actions du joueur
import { useGameStore } from '../lib/store';
import Card, { CostBadge, EffectBadge } from './Card';

function checkCanBuild(card, player) {
  if (!card || !player) return { ok: false, missing: {}, coinsNeeded: 0, cantAfford: false, missingResources: false };
  const cost = card.cost;
  if (!cost || cost.length === 0) return { ok: true, missing: {}, coinsNeeded: 0, cantAfford: false, missingResources: false };

  const needed = {};
  const costArr = Array.isArray(cost) ? cost : [cost];
  costArr.forEach(c => {
    Object.entries(c).forEach(([res, amt]) => {
      if (res !== 'coin') needed[res] = (needed[res] || 0) + amt;
    });
  });

  const coinsNeeded = costArr.reduce((sum, c) => sum + (c.coin || 0), 0);

  const missing = {};
  Object.entries(needed).forEach(([res, amt]) => {
    const have = player.resources?.[res] || 0;
    if (have < amt) missing[res] = amt - have;
  });

  const hasMissing = Object.keys(missing).length > 0;
  const cantAfford = !hasMissing && (player.coins || 0) < coinsNeeded;

  return {
    ok: !hasMissing && !cantAfford,
    missing,
    coinsNeeded,
    cantAfford,
    missingResources: hasMissing,
  };
}

export default function ActionPanel() {
  const {
    selectedCard, selectedAction, selectAction, playCard,
    hasPlayedThisTurn, waitingFor, myPlayer,
  } = useGameStore();

  const buildCheck = checkCanBuild(selectedCard, myPlayer);
  const canPlay = selectedCard && selectedAction && !hasPlayedThisTurn
    && (selectedAction !== 'play' || buildCheck.ok);

  const ACTIONS = [
    {
      id: 'play',
      icon: '🏗️',
      label: 'Construire',
      desc: buildCheck.missingResources
        ? 'Ressources insuffisantes'
        : buildCheck.cantAfford
          ? `Manque ${buildCheck.coinsNeeded - (myPlayer?.coins || 0)}🪙`
          : 'Jouer la carte dans ta cité',
      color: '#42A5F5',
      disabled: !buildCheck.ok,
    },
    {
      id: 'sell',
      icon: '🪙',
      label: 'Vendre',
      desc: '+3 pièces',
      color: '#FFD700',
    },
    {
      id: 'wonder',
      icon: '🏛️',
      label: 'Merveille',
      desc: `Construire étape ${myPlayer ? myPlayer.wonderStagesBuilt + 1 : 1}`,
      color: '#CE93D8',
      disabled: myPlayer?.wonderStagesBuilt >= myPlayer?.wonder?.stages?.length,
    },
  ];

  if (hasPlayedThisTurn) {
    return (
      <div className="panel p-4 text-center animate-slide-up">
        <div className="text-2xl mb-2">⏳</div>
        <p className="font-display text-gold-400 text-sm mb-1">En attente des autres joueurs</p>
        {waitingFor.length > 0 && (
          <p className="text-xs font-body text-ancient-stone">
            Reste : {waitingFor.join(', ')}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      {/* Carte sélectionnée */}
      {selectedCard ? (
        <div className="panel-gold p-4 mb-3">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Card card={selectedCard} size="large" interactive={false} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-gold-400 mb-1">{selectedCard.name}</h3>
              <div className="mb-2">
                <p className="text-xs font-body text-ancient-stone mb-1">Coût :</p>
                <CostBadge cost={selectedCard.cost} />
              </div>
              <div>
                <p className="text-xs font-body text-ancient-stone mb-1">Effet :</p>
                <EffectBadge effect={selectedCard.effect} />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {ACTIONS.map(action => {
              const isSelected = selectedAction === action.id;
              const isDisabled = !!action.disabled;
              const descColor = action.id === 'play' && buildCheck.cantAfford
                ? '#EF5350'
                : action.id === 'play' && buildCheck.needsTrade
                  ? '#FFA726'
                  : undefined;
              return (
                <button
                  key={action.id}
                  disabled={isDisabled}
                  onClick={() => selectAction(action.id)}
                  className={`p-2 rounded-lg text-center transition-all border text-xs font-body font-semibold ${
                    isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: isSelected ? action.color + '33' : 'rgba(0,0,0,0.3)',
                    borderColor: isDisabled ? '#44444488'
                      : isSelected ? action.color : action.color + '44',
                    color: isDisabled ? '#666'
                      : isSelected ? action.color : '#f5e6c8',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.5 : 1,
                  }}>
                  <div className="text-lg mb-1">{action.icon}</div>
                  <div className="font-bold text-xs">{action.label}</div>
                  <div className="text-xs opacity-80" style={{ color: descColor }}>{action.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Message ressources insuffisantes */}
          {selectedAction === 'play' && !buildCheck.ok && (
            <div className="mt-3 px-4 py-2 rounded-lg text-center"
              style={{ background: '#7B1D1D', border: '1px solid #EF5350' }}>
              <p className="font-body text-red-200 text-sm">
                {buildCheck.missingResources
                  ? `⚠️ Ressources manquantes : ${Object.entries(buildCheck.missing).map(([r, n]) => `${n} ${r}`).join(', ')}`
                  : `⚠️ Pas assez de pièces (besoin : ${buildCheck.coinsNeeded}🪙)`}
              </p>
            </div>
          )}

          {/* Confirmer */}
          <button
            onClick={playCard}
            disabled={!canPlay}
            className="btn-gold w-full py-3 rounded-lg mt-3 text-sm tracking-widest animate-glow">
            {selectedAction ? `✅ CONFIRMER : ${ACTIONS.find(a => a.id === selectedAction)?.label.toUpperCase()}` : '← Choisir une action'}
          </button>
        </div>
      ) : (
        <div className="panel p-4 text-center">
          <p className="text-ancient-sand font-body text-sm mb-1">
            🎴 Clique sur une carte pour la sélectionner
          </p>
          <p className="text-ancient-stone font-body text-xs">
            Tu as {myPlayer?.hand?.length || 0} cartes en main
          </p>
        </div>
      )}
    </div>
  );
}
