# 7 Wonders Online — Guide Claude Code

## INSTALLATION
```bash
cd backend && npm install
cd ../frontend && npm install
node scripts/generate-card-svgs.js
```

## DÉVELOPPEMENT
```bash
cd backend && npm run dev      # Terminal 1 — port 3001
cd frontend && npm run dev     # Terminal 2 — port 5173
```

## ARCHITECTURE
| Fichier | Rôle |
|---------|------|
| backend/src/server.js | Serveur Express + Socket.io |
| backend/src/gameEngine.js | Logique jeu (draft, scores) |
| backend/src/cards.js | Données cartes + merveilles |
| frontend/src/lib/store.js | État global Zustand |
| frontend/src/pages/GamePage.jsx | Interface principale |
| frontend/src/components/Card.jsx | Composant carte SVG |
| scripts/generate-card-svgs.js | Générateur SVG |

## AJOUTER UNE CARTE
1. Modifier backend/src/cards.js — ajouter dans age1/age2/age3
2. Relancer : node scripts/generate-card-svgs.js
3. Le SVG est auto-généré dans frontend/src/assets/cards/

## DÉPLOIEMENT RAILWAY (backend)
- Root: backend/
- Start: node src/server.js
- Env: FRONTEND_URL=https://ton-app.vercel.app

## DÉPLOIEMENT VERCEL (frontend)
- Root: frontend/
- Build: npm run build
- Env: VITE_BACKEND_URL=https://ton-backend.railway.app
