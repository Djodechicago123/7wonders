#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# setup.sh — Script d'installation automatique 7 Wonders Online
# Lancé automatiquement par Claude Code
# ═══════════════════════════════════════════════════════════════

set -e  # Arrête si erreur

GREEN='\033[0;32m'
GOLD='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${GOLD}╔════════════════════════════════════════╗${NC}"
echo -e "${GOLD}║      🏛️  7 WONDERS ONLINE SETUP        ║${NC}"
echo -e "${GOLD}╚════════════════════════════════════════╝${NC}"
echo ""

# ── Vérifier Node.js ─────────────────────────────────────────
echo -e "${GOLD}[1/5] Vérification de Node.js...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js non trouvé. Installe-le sur https://nodejs.org${NC}"
  exit 1
fi
NODE_VERSION=$(node -v | sed 's/v//' | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${RED}❌ Node.js $NODE_VERSION trouvé, version 18+ requise.${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) OK${NC}"

# ── Installer les dépendances Backend ────────────────────────
echo ""
echo -e "${GOLD}[2/5] Installation des dépendances backend...${NC}"
cd backend
npm install --silent
echo -e "${GREEN}✅ Backend installé${NC}"
cd ..

# ── Installer les dépendances Frontend ───────────────────────
echo ""
echo -e "${GOLD}[3/5] Installation des dépendances frontend...${NC}"
cd frontend
npm install --silent
echo -e "${GREEN}✅ Frontend installé${NC}"
cd ..

# ── Créer les fichiers .env ───────────────────────────────────
echo ""
echo -e "${GOLD}[4/5] Configuration des variables d'environnement...${NC}"

if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo -e "${GREEN}✅ backend/.env créé${NC}"
else
  echo -e "${GREEN}✅ backend/.env déjà présent${NC}"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo -e "${GREEN}✅ frontend/.env créé${NC}"
else
  echo -e "${GREEN}✅ frontend/.env déjà présent${NC}"
fi

# ── Générer les assets SVG des cartes ────────────────────────
echo ""
echo -e "${GOLD}[5/5] Génération des assets de cartes...${NC}"
mkdir -p frontend/src/assets/cards
node scripts/generate-card-svgs.js
echo -e "${GREEN}✅ SVG des cartes générés${NC}"

# ── Résumé ───────────────────────────────────────────────────
echo ""
echo -e "${GOLD}╔════════════════════════════════════════╗${NC}"
echo -e "${GOLD}║         ✅ INSTALLATION COMPLÈTE        ║${NC}"
echo -e "${GOLD}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "Pour démarrer le projet :"
echo -e "  ${GREEN}npm run dev:backend${NC}   ← Terminal 1"
echo -e "  ${GREEN}npm run dev:frontend${NC}  ← Terminal 2"
echo ""
echo -e "Puis ouvrir : ${GOLD}http://localhost:5173${NC}"
echo ""
