// GuideModal.jsx - Guide complet des règles
import { useState } from 'react';

const TABS = [
  { id: 'overview', label: '📖 Comment jouer' },
  { id: 'cards',    label: '🃏 Types de cartes' },
  { id: 'wonders',  label: '🏛️ Merveilles' },
  { id: 'scoring',  label: '🏆 Scoring' },
];

const CARD_TYPES = [
  {
    color: '#8B4513', label: 'Ressources brunes', icon: '🪵',
    desc: 'Produisent des matières premières : bois, argile, minerai, pierre. Ressources de base pour construire.',
    examples: ['Chantier → 🪵 bois', 'Carrière → 🪨 pierre', 'Bassin Argileux → 🧱 argile'],
  },
  {
    color: '#9B8B6E', label: 'Ressources grises', icon: '🔮',
    desc: 'Produisent des biens manufacturés : verre, textile, papyrus. Requis pour les cartes avancées.',
    examples: ['Verrerie → 🔮 verre', 'Moulin → 📜 papyrus', 'Presse → 🧵 textile'],
  },
  {
    color: '#1565C0', label: 'Civil (bleu)', icon: '🏛️',
    desc: 'Donnent directement des points de victoire. Jouez-en le plus possible !',
    examples: ['Autel → 2 VP', 'Bains → 3 VP', 'Panthéon → 7 VP'],
  },
  {
    color: '#F9A825', label: 'Commerce (jaune)', icon: '💛',
    desc: 'Pièces, réductions de commerce ou bonus spéciaux en fin de partie.',
    examples: ['Taverne → +5 pièces', 'Vignoble → pièces par ressource', 'Forum → réduit commerce'],
  },
  {
    color: '#C62828', label: 'Militaire (rouge)', icon: '⚔️',
    desc: 'Boucliers pour les conflits. À la fin de chaque âge, tu te bats contre tes 2 voisins.',
    examples: ['Palissade → 1 bouclier', 'Muraille → 2 boucliers', 'Fortifications → 3 boucliers'],
  },
  {
    color: '#2E7D32', label: 'Science (vert)', icon: '🔬',
    desc: 'Trois symboles : compas 🧭, tablette 📋, rouage ⚙️. Score exponentiel — les séries rapportent beaucoup.',
    examples: ['Officine → 🧭 compas', 'Scriptorium → 📋 tablette', 'Atelier → ⚙️ rouage'],
  },
  {
    color: '#6A1B9A', label: 'Guildes (violet)', icon: '💜',
    desc: 'Âge III seulement. Donnent des VP selon les réalisations de tes voisins.',
    examples: ['Guilde des Commerçants → VP par carte commerce voisins', 'Guilde des Bâtisseurs → VP par étape merveille'],
  },
];

const WONDERS_INFO = [
  { name: 'Gizeh 🔺', color: '#D4AC0D', res: '🪨 Pierre', strategy: 'VP pur — 3+5+7=15 VP en 3 étapes. Stratégie simple et solide.' },
  { name: 'Rhodes 🗿', color: '#EF5350', res: '⚙️ Minerai', strategy: 'Militaire + économie. Étape 2 : +3 pièces et +3 VP. Polyvalent.' },
  { name: 'Alexandrie 💡', color: '#42A5F5', res: '🔮 Verre', strategy: 'Flexibilité max. Étape 2 donne une ressource "n\'importe laquelle" par tour.' },
  { name: 'Babylone 🌿', color: '#FF7043', res: '🧱 Argile', strategy: 'Science OP. Étapes 2 et 3 donnent un symbole science au choix.' },
  { name: 'Olympie 🔥', color: '#66BB6A', res: '🪵 Bois', strategy: 'Étape 2 : construire une carte par âge GRATUITEMENT. Économies massives.' },
  { name: 'Halicarnasse 🏺', color: '#CE93D8', res: '🧵 Textile', strategy: 'Récupère des cartes défaussées. Très puissant en fin de partie.' },
  { name: 'Éphèse 🏛️', color: '#FFA726', res: '📜 Papyrus', strategy: 'Étape 2 : +9 pièces ! Commerce et flexibilité économique.' },
];

function TabOverview() {
  return (
    <div className="space-y-4">
      <div className="panel p-4">
        <h3 className="font-display text-gold-400 text-sm mb-3">🎯 Objectif</h3>
        <p className="text-ancient-sand font-body text-sm leading-relaxed">
          Construire la civilisation la plus prospère en 3 âges. Chaque âge, tu joues 6 cartes — une par tour.
          La main passe de joueur en joueur. Le joueur avec le plus de points de victoire gagne.
        </p>
      </div>

      <div className="panel p-4">
        <h3 className="font-display text-gold-400 text-sm mb-3">🔄 Déroulement d'un tour</h3>
        <ol className="space-y-2">
          {[
            ['1.', 'Regarde ta main de cartes'],
            ['2.', 'Clique sur une carte pour la sélectionner (ou ← → au clavier)'],
            ['3.', 'Choisis une action : Construire, Vendre (+3🪙), ou Merveille'],
            ['4.', 'Confirme — tous les joueurs jouent en même temps'],
            ['5.', 'Les mains tournent (droite aux âges 1 & 3, gauche à l\'âge 2)'],
          ].map(([num, text]) => (
            <li key={num} className="flex gap-3 text-sm font-body text-ancient-sand">
              <span className="font-display text-gold-400 font-bold flex-shrink-0">{num}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="panel p-4">
        <h3 className="font-display text-gold-400 text-sm mb-3">⚔️ Conflits militaires</h3>
        <p className="text-ancient-sand font-body text-sm leading-relaxed">
          À la fin de chaque âge, tu te bats contre tes 2 voisins (gauche & droite).
          Le plus de boucliers ⚔️ gagne : <strong className="text-gold-400">+1 VP</strong> (âge 1),{' '}
          <strong className="text-gold-400">+3 VP</strong> (âge 2), <strong className="text-gold-400">+5 VP</strong> (âge 3).
          La défaite coûte <strong className="text-red-400">-1 VP</strong>.
        </p>
      </div>

      <div className="panel p-4">
        <h3 className="font-display text-gold-400 text-sm mb-3">💡 Conseils débutant</h3>
        <ul className="space-y-1">
          {[
            'Construis des ressources dès l\'âge 1 — elles seront utiles toute la partie',
            'Ne néglige pas les cartes gratuites (coût vide) — profit immédiat',
            'Regarde ce que construisent tes voisins : ne pas les aider à la science !',
            'Si tu ne peux pas construire, vendre pour +3🪙 est toujours utile',
            'Une merveille bien construite vaut souvent 10-15+ VP',
          ].map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm font-body text-ancient-sand">
              <span className="text-green-400 flex-shrink-0">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TabCards() {
  return (
    <div className="space-y-3">
      {CARD_TYPES.map(ct => (
        <div key={ct.label} className="panel p-3" style={{ borderColor: ct.color + '55' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{ct.icon}</span>
            <h4 className="font-display text-sm font-bold" style={{ color: ct.color }}>{ct.label}</h4>
          </div>
          <p className="text-ancient-sand font-body text-xs leading-relaxed mb-2">{ct.desc}</p>
          <div className="flex flex-wrap gap-1">
            {ct.examples.map(ex => (
              <span key={ex} className="text-xs font-body px-2 py-0.5 rounded"
                style={{ background: ct.color + '22', color: ct.color, border: `1px solid ${ct.color}44` }}>
                {ex}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TabWonders() {
  return (
    <div className="space-y-3">
      <div className="panel p-4">
        <h3 className="font-display text-gold-400 text-sm mb-2">🏛️ Les merveilles</h3>
        <p className="text-ancient-sand font-body text-xs leading-relaxed">
          Chaque joueur a une merveille avec 3 étapes à construire. Utilise une carte de ta main comme
          "matériau" (elle est défaussée) et paie le coût de l'étape. Les effets peuvent être
          décisifs : VP massifs, science, pièces, construction gratuite...
        </p>
      </div>
      {WONDERS_INFO.map(w => (
        <div key={w.name} className="panel p-3" style={{ borderColor: w.color + '55' }}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-display text-sm font-bold" style={{ color: w.color }}>{w.name}</h4>
            <span className="text-xs font-body text-ancient-stone">{w.res}</span>
          </div>
          <p className="text-ancient-sand font-body text-xs leading-relaxed">{w.strategy}</p>
        </div>
      ))}
    </div>
  );
}

function TabScoring() {
  const rows = [
    { icon: '⚔️', label: 'Militaire', desc: '+1/-1 VP âge 1, +3/-1 VP âge 2, +5/-1 VP âge 3', color: '#EF5350' },
    { icon: '🏛️', label: 'Civil (bleu)', desc: 'Face de chaque carte (2 à 8 VP)', color: '#1565C0' },
    { icon: '🔬', label: 'Science', desc: 'Même symbole ×N : N² pts. Un de chaque : +7 pts par set complet', color: '#2E7D32' },
    { icon: '💛', label: 'Commerce', desc: 'Effets de fin de partie (VP par cartes voisins, étapes merveille...)', color: '#F9A825' },
    { icon: '🏺', label: 'Guildes', desc: 'VP selon les constructions de tes 2 voisins', color: '#6A1B9A' },
    { icon: '🏗️', label: 'Merveilles', desc: 'VP des étapes construites', color: '#D4AC0D' },
    { icon: '🪙', label: 'Pièces', desc: '1 VP par tranche de 3 pièces', color: '#FFD700' },
  ];

  return (
    <div className="space-y-3">
      <div className="panel p-4">
        <h3 className="font-display text-gold-400 text-sm mb-3">📊 Sources de points</h3>
        <div className="space-y-2">
          {rows.map(r => (
            <div key={r.label} className="flex gap-3 items-start p-2 rounded-lg" style={{ background: r.color + '11' }}>
              <span className="text-base flex-shrink-0">{r.icon}</span>
              <div>
                <p className="font-display text-xs font-bold" style={{ color: r.color }}>{r.label}</p>
                <p className="font-body text-xs text-ancient-sand">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-4">
        <h3 className="font-display text-gold-400 text-sm mb-2">🔬 Science — exemple</h3>
        <div className="font-body text-xs text-ancient-sand space-y-1">
          <p>Tu as : 🧭🧭🧭 📋📋 ⚙️</p>
          <p>Compas ×3 : 3² = <strong className="text-green-400">9 pts</strong></p>
          <p>Tablette ×2 : 2² = <strong className="text-green-400">4 pts</strong></p>
          <p>Rouage ×1 : 1² = <strong className="text-green-400">1 pt</strong></p>
          <p>1 set complet (1 de chaque) : <strong className="text-green-400">+7 pts</strong></p>
          <p className="text-gold-400 font-bold mt-1">Total science : 21 points !</p>
        </div>
      </div>
    </div>
  );
}

export default function GuideModal({ onClose }) {
  const [tab, setTab] = useState('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e120a 0%, #120a05 100%)', border: '2px solid #D4AC0D55' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-800/30">
          <h2 className="font-display text-gold-400 text-lg font-black tracking-widest">📜 GUIDE DU JOUEUR</h2>
          <button onClick={onClose}
            className="text-ancient-stone hover:text-gold-400 transition-colors text-lg leading-none">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gold-800/20 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-shrink-0 px-4 py-2.5 text-xs font-body font-semibold transition-all whitespace-nowrap"
              style={{
                color: tab === t.id ? '#D4AC0D' : '#9b8b6e',
                borderBottom: tab === t.id ? '2px solid #D4AC0D' : '2px solid transparent',
                background: tab === t.id ? 'rgba(212,172,13,0.07)' : 'transparent',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scroll">
          {tab === 'overview' && <TabOverview />}
          {tab === 'cards'    && <TabCards />}
          {tab === 'wonders'  && <TabWonders />}
          {tab === 'scoring'  && <TabScoring />}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gold-800/20 text-center">
          <p className="text-xs font-body text-ancient-stone">
            Bonne partie ! 🏛️ — Ferme avec ✕ ou en cliquant en dehors
          </p>
        </div>
      </div>
    </div>
  );
}
