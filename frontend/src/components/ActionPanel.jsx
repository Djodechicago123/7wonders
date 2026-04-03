// ActionPanel.jsx - Panneau d'actions du joueur
import { useGameStore } from '../lib/store';
import Card, { CostBadge, EffectBadge } from './Card';

export default function ActionPanel() {
  const {
    selectedCard, selectedAction, selectAction, playCard,
    hasPlayedThisTurn, waitingFor, myPlayer, game,
  } = useGameStore();

  const canPlay = selectedCard && selectedAction && !hasPlayedThisTurn;

  const ACTIONS = [
    {
      id: 'play',
      icon: '🏗️',
      label: 'Construire',
      desc: 'Jouer la carte dans ta cité',
      color: '#42A5F5',
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
            {ACTIONS.map(action => (
              <button
                key={action.id}
                disabled={action.disabled}
                onClick={() => selectAction(action.id)}
                className={`p-2 rounded-lg text-center transition-all border text-xs font-body font-semibold ${
                  selectedAction === action.id
                    ? 'scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: selectedAction === action.id ? action.color + '33' : 'rgba(0,0,0,0.3)',
                  borderColor: selectedAction === action.id ? action.color : action.color + '44',
                  color: action.disabled ? '#666' : selectedAction === action.id ? action.color : '#f5e6c8',
                  cursor: action.disabled ? 'not-allowed' : 'pointer',
                }}>
                <div className="text-lg mb-1">{action.icon}</div>
                <div className="font-bold text-xs">{action.label}</div>
                <div className="text-xs opacity-70">{action.desc}</div>
              </button>
            ))}
          </div>

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
