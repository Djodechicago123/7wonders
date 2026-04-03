// scripts/generate-card-svgs.js
// Génère les fichiers SVG pour chaque type de carte
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../frontend/src/assets/cards');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Palettes par type ──────────────────────────────────────────
const TYPE_THEMES = {
  resource: {
    bg1: '#3E2010', bg2: '#1C0D05',
    border: '#A0522D', borderLight: '#D2691E',
    label: '#FFD9B0', accent: '#CD853F',
    banner: '#6B3A1F', bannerText: '#FFD9B0',
    typeLabel: 'RESSOURCE',
    cornerDeco: '#CD853F',
    patternColor: '#5C2E0E',
  },
  civil: {
    bg1: '#0D2B5E', bg2: '#061428',
    border: '#3A7BD5', borderLight: '#5B9CF6',
    label: '#C8E0FF', accent: '#4A8FE8',
    banner: '#1A3F7A', bannerText: '#C8E0FF',
    typeLabel: 'CIVIL',
    cornerDeco: '#4A8FE8',
    patternColor: '#0D1F3C',
  },
  military: {
    bg1: '#5C0A0A', bg2: '#2A0404',
    border: '#CC2020', borderLight: '#FF5050',
    label: '#FFD0D0', accent: '#E03030',
    banner: '#7A1010', bannerText: '#FFD0D0',
    typeLabel: 'MILITAIRE',
    cornerDeco: '#E03030',
    patternColor: '#3A0808',
  },
  science: {
    bg1: '#0A3D1A', bg2: '#041A0A',
    border: '#2A8A40', borderLight: '#4ABB60',
    label: '#C0F0CC', accent: '#38A850',
    banner: '#0F5020', bannerText: '#C0F0CC',
    typeLabel: 'SCIENCE',
    cornerDeco: '#38A850',
    patternColor: '#062010',
  },
  commerce: {
    bg1: '#5C3000', bg2: '#2A1500',
    border: '#D47020', borderLight: '#FF9A30',
    label: '#FFE0B0', accent: '#E88020',
    banner: '#7A4010', bannerText: '#FFE0B0',
    typeLabel: 'COMMERCE',
    cornerDeco: '#E88020',
    patternColor: '#3A1E00',
  },
  guild: {
    bg1: '#2A0A4A', bg2: '#12042A',
    border: '#8A30CC', borderLight: '#BB60FF',
    label: '#EAC8FF', accent: '#A040E0',
    banner: '#3A0F6A', bannerText: '#EAC8FF',
    typeLabel: 'GUILDE',
    cornerDeco: '#A040E0',
    patternColor: '#1A0630',
  },
};

// ── Icônes SVG par type ───────────────────────────────────────
const TYPE_ICONS = {
  resource: `<path d="M60 25 L75 45 L60 65 L45 45 Z" fill="#CD853F" opacity="0.8"/>
    <path d="M60 30 L72 45 L60 60 L48 45 Z" fill="#A0522D" opacity="0.6"/>
    <circle cx="60" cy="45" r="8" fill="#FFD9B0" opacity="0.9"/>`,

  civil: `<path d="M40 65 L40 35 M50 65 L50 30 M60 65 L60 28 M70 65 L70 30 M80 65 L80 35" stroke="#4A8FE8" stroke-width="4" stroke-linecap="round"/>
    <rect x="35" y="65" width="50" height="5" rx="2" fill="#4A8FE8"/>
    <path d="M35 35 L60 18 L85 35 Z" fill="#3A7BD5" stroke="#5B9CF6" stroke-width="1"/>`,

  military: `<path d="M60 20 L65 38 L80 38 L68 49 L73 67 L60 57 L47 67 L52 49 L40 38 L55 38 Z" fill="#E03030" stroke="#FF5050" stroke-width="1.5"/>`,

  science: `<circle cx="60" cy="42" r="16" fill="none" stroke="#38A850" stroke-width="2"/>
    <circle cx="60" cy="42" r="8" fill="#38A850" opacity="0.6"/>
    <line x1="60" y1="20" x2="60" y2="64" stroke="#38A850" stroke-width="1.5"/>
    <line x1="38" y1="42" x2="82" y2="42" stroke="#38A850" stroke-width="1.5"/>
    <line x1="44" y1="26" x2="76" y2="58" stroke="#38A850" stroke-width="1"/>
    <line x1="76" y1="26" x2="44" y2="58" stroke="#38A850" stroke-width="1"/>`,

  commerce: `<path d="M45 55 Q60 25 75 55" fill="none" stroke="#E88020" stroke-width="3" stroke-linecap="round"/>
    <circle cx="48" cy="52" r="5" fill="#E88020"/>
    <circle cx="72" cy="52" r="5" fill="#E88020"/>
    <circle cx="60" cy="33" r="5" fill="#FFE0B0"/>
    <path d="M50 58 L70 58 L66 68 L54 68 Z" fill="#D47020"/>`,

  guild: `<path d="M60 20 L65 35 L80 35 L68 45 L72 60 L60 52 L48 60 L52 45 L40 35 L55 35 Z" fill="#A040E0" stroke="#BB60FF" stroke-width="1.5"/>
    <circle cx="60" cy="42" r="6" fill="#EAC8FF" opacity="0.8"/>`,
};

// ── Patterns de fond par type ─────────────────────────────────
function bgPattern(type, t) {
  const c = t.patternColor;
  switch (type) {
    case 'resource':
      return `<pattern id="pat" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.6"/>
      </pattern>`;
    case 'civil':
      return `<pattern id="pat" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M12 0 L12 24 M0 12 L24 12" stroke="${c}" stroke-width="0.5" opacity="0.5"/>
      </pattern>`;
    case 'military':
      return `<pattern id="pat" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M0 0 L16 16 M16 0 L0 16" stroke="${c}" stroke-width="0.5" opacity="0.5"/>
      </pattern>`;
    case 'science':
      return `<pattern id="pat" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="3" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.6"/>
      </pattern>`;
    case 'commerce':
      return `<pattern id="pat" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
        <path d="M0 9 Q4.5 0 9 9 Q13.5 18 18 9" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.5"/>
      </pattern>`;
    case 'guild':
      return `<pattern id="pat" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
        <path d="M11 0 L13 7 L22 7 L15 12 L18 19 L11 14 L4 19 L7 12 L0 7 L9 7 Z" fill="${c}" opacity="0.4"/>
      </pattern>`;
    default:
      return `<pattern id="pat" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="${c}" opacity="0.2"/>
      </pattern>`;
  }
}

// ── Rendu des coûts ──────────────────────────────────────────
const RESOURCE_COLORS = {
  wood: '#8B4513', clay: '#D2691E', ore: '#607D8B',
  stone: '#78909C', papyrus: '#9E8B5E', glass: '#26C6DA',
  textile: '#AB47BC', coin: '#FFD700',
};
const RESOURCE_SYMBOLS = {
  wood: '🪵', clay: '🧱', ore: '⚙', stone: '🪨',
  papyrus: '📜', glass: '◈', textile: '❋', coin: '◉',
};

function renderCostBadges(cost) {
  if (!cost || cost.length === 0) {
    return `<text x="60" y="88" text-anchor="middle" font-family="Georgia,serif" font-size="7" fill="#80FF80" font-weight="bold">GRATUIT</text>`;
  }
  const items = [];
  (Array.isArray(cost) ? cost : [cost]).forEach(c => {
    Object.entries(c).forEach(([res, amt]) => {
      for (let i = 0; i < amt; i++) items.push(res);
    });
  });
  const total = items.length;
  const startX = 60 - (total * 11) / 2 + 5.5;
  return items.map((res, i) => {
    const x = startX + i * 11;
    const col = RESOURCE_COLORS[res] || '#888';
    const sym = RESOURCE_SYMBOLS[res] || '?';
    return `<circle cx="${x}" cy="87" r="5" fill="${col}" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
      <text x="${x}" y="90" text-anchor="middle" font-size="5.5" fill="white">${sym}</text>`;
  }).join('\n');
}

function renderEffectText(effect) {
  if (!effect) return '';
  const lines = [];
  if (effect.resources) {
    Object.entries(effect.resources).forEach(([r, a]) => {
      lines.push(`+${a} ${RESOURCE_SYMBOLS[r] || r}`);
    });
  }
  if (effect.vp) lines.push(`+${effect.vp} ★`);
  if (effect.coins) lines.push(`+${effect.coins} ◉`);
  if (effect.shields) lines.push(`+${effect.shields} ⚔`);
  if (effect.science) {
    const s = { compass: '🧭', tablet: '📋', gear: '⚙', any: '?' };
    lines.push(s[effect.science] || effect.science);
  }
  if (effect.tradeLeft || effect.tradeRight) lines.push('Commerce ×1');
  if (effect.freeBuild) lines.push('Gratuit 1×');

  return lines.slice(0, 2).map((l, i) =>
    `<text x="60" y="${108 + i * 10}" text-anchor="middle" font-family="Georgia,serif" font-size="7.5" fill="white" font-weight="bold">${l}</text>`
  ).join('\n');
}

// ── Générateur principal SVG ──────────────────────────────────
function generateCardSVG(card) {
  const t = TYPE_THEMES[card.type] || TYPE_THEMES.resource;
  const icon = TYPE_ICONS[card.type] || '';

  // Tronquer le nom si trop long
  const name = card.name.length > 14 ? card.name.substring(0, 13) + '…' : card.name;
  const nameFontSize = card.name.length > 10 ? 8 : 9.5;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 170" width="120" height="170">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.bg1}"/>
      <stop offset="100%" stop-color="${t.bg2}"/>
    </linearGradient>
    <linearGradient id="banner" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.banner}"/>
      <stop offset="100%" stop-color="${t.bg2}"/>
    </linearGradient>
    <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0.0)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
    </linearGradient>
    <clipPath id="cardClip">
      <rect x="2" y="2" width="116" height="166" rx="10" ry="10"/>
    </clipPath>
    ${bgPattern(card.type, t)}
  </defs>

  <!-- Fond principal -->
  <rect x="2" y="2" width="116" height="166" rx="10" fill="url(#bg)" clip-path="url(#cardClip)"/>
  <rect x="2" y="2" width="116" height="166" rx="10" fill="url(#pat)" clip-path="url(#cardClip)"/>
  <rect x="2" y="2" width="116" height="166" rx="10" fill="url(#shimmer)" clip-path="url(#cardClip)"/>

  <!-- Bordure extérieure double -->
  <rect x="1" y="1" width="118" height="168" rx="11" fill="none" stroke="${t.border}" stroke-width="2.5"/>
  <rect x="4" y="4" width="112" height="162" rx="8" fill="none" stroke="${t.borderLight}" stroke-width="0.8" opacity="0.5"/>

  <!-- Ornements coins -->
  <circle cx="12" cy="12" r="5" fill="${t.cornerDeco}" opacity="0.6"/>
  <circle cx="108" cy="12" r="5" fill="${t.cornerDeco}" opacity="0.6"/>
  <circle cx="12" cy="158" r="5" fill="${t.cornerDeco}" opacity="0.6"/>
  <circle cx="108" cy="158" r="5" fill="${t.cornerDeco}" opacity="0.6"/>
  <path d="M7 12 L12 7 M108 7 L113 12 M7 158 L12 163 M113 158 L108 163" stroke="${t.borderLight}" stroke-width="1" opacity="0.6"/>

  <!-- Zone icône -->
  <rect x="30" y="18" width="60" height="58" rx="6" fill="rgba(0,0,0,0.35)"/>
  <rect x="30" y="18" width="60" height="58" rx="6" fill="none" stroke="${t.border}" stroke-width="1" opacity="0.6"/>
  <g clip-path="url(#cardClip)" transform="translate(0, 5)">
    ${icon}
  </g>

  <!-- Bandeau nom -->
  <rect x="6" y="80" width="108" height="20" rx="4" fill="url(#banner)"/>
  <rect x="6" y="80" width="108" height="20" rx="4" fill="none" stroke="${t.border}" stroke-width="0.8" opacity="0.5"/>
  <text x="60" y="93" text-anchor="middle" font-family="Georgia,serif" font-size="${nameFontSize}" font-weight="bold" fill="${t.label}" letter-spacing="0.5">${name.toUpperCase()}</text>

  <!-- Zone coût -->
  <text x="60" y="82" text-anchor="middle" font-family="sans-serif" font-size="5.5" fill="${t.accent}" opacity="0.8" letter-spacing="1">COÛT</text>
  ${renderCostBadges(card.cost)}

  <!-- Séparateur -->
  <line x1="15" y1="100" x2="105" y2="100" stroke="${t.border}" stroke-width="0.8" opacity="0.6"/>

  <!-- Zone effet -->
  <rect x="8" y="102" width="104" height="50" rx="4" fill="rgba(0,0,0,0.25)"/>
  ${renderEffectText(card.effect)}

  <!-- Badge type bas -->
  <rect x="22" y="154" width="76" height="12" rx="5" fill="${t.banner}"/>
  <rect x="22" y="154" width="76" height="12" rx="5" fill="none" stroke="${t.border}" stroke-width="0.8"/>
  <text x="60" y="163" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="bold" fill="${t.label}" letter-spacing="1.5">${t.typeLabel}</text>

  <!-- Âge indicator -->
  <text x="60" y="148" text-anchor="middle" font-family="sans-serif" font-size="5.5" fill="${t.accent}" opacity="0.7">ÂGE ${card.age}</text>
</svg>`;
}

// ── Dos de carte ──────────────────────────────────────────────
function generateCardBack() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 170" width="120" height="170">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2c1810"/>
      <stop offset="100%" stop-color="#0d0905"/>
    </linearGradient>
    <pattern id="grid" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
      <path d="M0 0 L12 0 L12 12 L0 12 Z" fill="none" stroke="rgba(212,172,13,0.08)" stroke-width="0.5"/>
    </pattern>
    <pattern id="star" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M12 6 L13.5 10.5 L18 10.5 L14.5 13 L16 17.5 L12 15 L8 17.5 L9.5 13 L6 10.5 L10.5 10.5 Z"
        fill="rgba(212,172,13,0.06)"/>
    </pattern>
  </defs>

  <!-- Fond -->
  <rect x="2" y="2" width="116" height="166" rx="10" fill="url(#bg)"/>
  <rect x="2" y="2" width="116" height="166" rx="10" fill="url(#grid)"/>
  <rect x="2" y="2" width="116" height="166" rx="10" fill="url(#star)"/>

  <!-- Bordure dorée double -->
  <rect x="1" y="1" width="118" height="168" rx="11" fill="none" stroke="#D4AC0D" stroke-width="2"/>
  <rect x="5" y="5" width="110" height="160" rx="8" fill="none" stroke="#D4AC0D" stroke-width="0.8" opacity="0.5"/>

  <!-- Ornements coins -->
  <path d="M8 8 L18 8 L18 10 L10 10 L10 18 L8 18 Z" fill="#D4AC0D" opacity="0.7"/>
  <path d="M112 8 L102 8 L102 10 L110 10 L110 18 L112 18 Z" fill="#D4AC0D" opacity="0.7"/>
  <path d="M8 162 L18 162 L18 160 L10 160 L10 152 L8 152 Z" fill="#D4AC0D" opacity="0.7"/>
  <path d="M112 162 L102 162 L102 160 L110 160 L110 152 L112 152 Z" fill="#D4AC0D" opacity="0.7"/>

  <!-- Médaillon central -->
  <circle cx="60" cy="85" r="38" fill="none" stroke="#D4AC0D" stroke-width="1" opacity="0.3"/>
  <circle cx="60" cy="85" r="30" fill="none" stroke="#D4AC0D" stroke-width="0.5" opacity="0.4"/>
  <circle cx="60" cy="85" r="20" fill="rgba(212,172,13,0.1)" stroke="#D4AC0D" stroke-width="1" opacity="0.5"/>

  <!-- Logo / Texte central -->
  <text x="60" y="76" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#D4AC0D" opacity="0.7">🏛</text>
  <text x="60" y="94" text-anchor="middle" font-family="Georgia,serif" font-size="9" font-weight="bold" fill="#D4AC0D" letter-spacing="2" opacity="0.8">7 WONDERS</text>

  <!-- Lignes décoratives -->
  <line x1="15" y1="85" x2="32" y2="85" stroke="#D4AC0D" stroke-width="0.8" opacity="0.4"/>
  <line x1="88" y1="85" x2="105" y2="85" stroke="#D4AC0D" stroke-width="0.8" opacity="0.4"/>
  <path d="M22 45 Q60 30 98 45" fill="none" stroke="#D4AC0D" stroke-width="0.8" opacity="0.3"/>
  <path d="M22 125 Q60 140 98 125" fill="none" stroke="#D4AC0D" stroke-width="0.8" opacity="0.3"/>
</svg>`;
}

// ── Cartes de merveille ──────────────────────────────────────
function generateWonderCardSVG(wonder) {
  const wonderColors = {
    Rhodes: { bg1:'#4a1010', bg2:'#1a0505', accent:'#EF5350', text:'#FFD0D0' },
    Alexandrie: { bg1:'#0d2744', bg2:'#05101e', accent:'#42A5F5', text:'#C8E0FF' },
    'Ephèse': { bg1:'#4a3900', bg2:'#1e1700', accent:'#FFA726', text:'#FFE0B0' },
    Babylone: { bg1:'#3a1a00', bg2:'#160900', accent:'#FF7043', text:'#FFD0C0' },
    Olympie: { bg1:'#0d3318', bg2:'#041509', accent:'#66BB6A', text:'#C0F0CC' },
    Halicarnasse: { bg1:'#2d0d4a', bg2:'#12041e', accent:'#CE93D8', text:'#EAC8FF' },
    Gizeh: { bg1:'#4a3a00', bg2:'#1e1600', accent:'#FFD700', text:'#FFF0B0' },
  };
  const c = wonderColors[wonder.name] || wonderColors.Gizeh;

  const stagesHTML = wonder.stages.map((stage, i) => {
    const x = 10 + i * 35;
    return `<rect x="${x}" y="126" width="28" height="26" rx="4" fill="rgba(0,0,0,0.4)" stroke="${c.accent}" stroke-width="0.8" opacity="0.7"/>
    <text x="${x + 14}" y="137" text-anchor="middle" font-size="5.5" fill="${c.accent}" font-family="sans-serif" opacity="0.8">ÉT.${i+1}</text>
    <text x="${x + 14}" y="148" text-anchor="middle" font-size="7" fill="${c.text}" font-family="Georgia,serif">${stage.effect?.vp ? '+'+stage.effect.vp+'★' : stage.effect?.shields ? '+'+stage.effect.shields+'⚔' : stage.effect?.coins ? '+'+stage.effect.coins+'◉' : '✦'}</text>`;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 170" width="120" height="170">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${c.bg1}"/>
      <stop offset="100%" stop-color="${c.bg2}"/>
    </linearGradient>
    <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.1)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.0)"/>
    </linearGradient>
  </defs>

  <rect x="2" y="2" width="116" height="166" rx="10" fill="url(#bg)"/>
  <rect x="2" y="2" width="116" height="166" rx="10" fill="url(#shimmer)"/>
  <rect x="1" y="1" width="118" height="168" rx="11" fill="none" stroke="${c.accent}" stroke-width="2.5"/>
  <rect x="4" y="4" width="112" height="162" rx="8" fill="none" stroke="${c.accent}" stroke-width="0.8" opacity="0.4"/>

  <!-- Icône grande -->
  <text x="60" y="72" text-anchor="middle" font-size="44" font-family="serif">${wonder.icon}</text>

  <!-- Nom -->
  <rect x="8" y="78" width="104" height="22" rx="4" fill="rgba(0,0,0,0.5)"/>
  <text x="60" y="93" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="bold" fill="${c.accent}" letter-spacing="1">${wonder.name.toUpperCase()}</text>

  <!-- Ressource de départ -->
  <text x="60" y="110" text-anchor="middle" font-family="sans-serif" font-size="7" fill="${c.text}" opacity="0.8">RESSOURCE DE DÉPART</text>
  <text x="60" y="122" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="${c.text}" font-weight="bold">
    ${Object.entries(wonder.startResource).map(([r,a]) => `${RESOURCE_SYMBOLS[r]||r} ×${a}`).join(' ')}
  </text>

  <!-- Étapes -->
  ${stagesHTML}

  <!-- Badge MERVEILLE -->
  <rect x="20" y="156" width="80" height="10" rx="4" fill="${c.accent}" opacity="0.3"/>
  <text x="60" y="164" text-anchor="middle" font-family="sans-serif" font-size="6" fill="${c.text}" letter-spacing="2" font-weight="bold">MERVEILLE</text>
</svg>`;
}

// ── Charger les données ───────────────────────────────────────
const { CARDS, WONDERS } = require('../backend/src/cards.js');

let generated = 0;

// Générer chaque carte
['age1', 'age2', 'age3'].forEach(age => {
  CARDS[age].forEach(card => {
    const svg = generateCardSVG(card);
    const filename = `card-${card.id}.svg`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), svg);
    generated++;
  });
});

// Dos de carte
fs.writeFileSync(path.join(OUTPUT_DIR, 'card-back.svg'), generateCardBack());
generated++;

// Merveilles
WONDERS.forEach(wonder => {
  const svg = generateWonderCardSVG(wonder);
  const filename = `wonder-${wonder.id}.svg`;
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), svg);
  generated++;
});

console.log(`✅ ${generated} SVG générés dans frontend/src/assets/cards/`);
