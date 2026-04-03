#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# deploy.sh — Déploiement automatique Railway + Vercel
# Usage: bash deploy.sh
# ═══════════════════════════════════════════════════════════════

set -e
GREEN='\033[0;32m'
GOLD='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${GOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${GOLD}║    🚀  7 WONDERS — DÉPLOIEMENT AUTO      ║${NC}"
echo -e "${GOLD}╚══════════════════════════════════════════╝${NC}"
echo ""

# ── Vérifier les outils requis ───────────────────────────────
check_tool() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}❌ '$1' non trouvé. Installe-le d'abord.${NC}"
    echo -e "   → $2"
    exit 1
  fi
  echo -e "${GREEN}✅ $1 disponible${NC}"
}

echo -e "${GOLD}[1/4] Vérification des outils...${NC}"
check_tool "git"    "https://git-scm.com"
check_tool "node"   "https://nodejs.org"

# Vercel CLI optionnel
HAS_VERCEL=false
if command -v vercel &> /dev/null; then
  HAS_VERCEL=true
  echo -e "${GREEN}✅ vercel CLI disponible${NC}"
else
  echo -e "${BLUE}ℹ️  vercel CLI non trouvé (déploiement manuel possible)${NC}"
fi

# Railway CLI optionnel
HAS_RAILWAY=false
if command -v railway &> /dev/null; then
  HAS_RAILWAY=true
  echo -e "${GREEN}✅ railway CLI disponible${NC}"
else
  echo -e "${BLUE}ℹ️  railway CLI non trouvé (déploiement manuel possible)${NC}"
fi

# ── Build frontend ───────────────────────────────────────────
echo ""
echo -e "${GOLD}[2/4] Build du frontend...${NC}"
cd frontend

# Régénérer les SVG des cartes
echo -e "  Génération des SVG cartes..."
cd ..
node scripts/generate-card-svgs.js
cd frontend

# Build Vite
npm run build 2>&1 | grep -E "(built|error|warn|dist)" || true

if [ -d "dist" ]; then
  SIZE=$(du -sh dist | cut -f1)
  echo -e "${GREEN}✅ Frontend buildé (${SIZE})${NC}"
else
  echo -e "${RED}❌ Build échoué — vérifier les erreurs ci-dessus${NC}"
  exit 1
fi
cd ..

# ── Déployer Backend sur Railway ─────────────────────────────
echo ""
echo -e "${GOLD}[3/4] Backend → Railway...${NC}"
if [ "$HAS_RAILWAY" = true ]; then
  cd backend
  railway up --detach 2>&1 | tail -3
  RAILWAY_URL=$(railway status 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
  cd ..
  if [ -n "$RAILWAY_URL" ]; then
    echo -e "${GREEN}✅ Backend déployé: ${RAILWAY_URL}${NC}"
    # Mettre à jour le .env frontend automatiquement
    echo "VITE_BACKEND_URL=${RAILWAY_URL}" > frontend/.env
    echo -e "${BLUE}ℹ️  VITE_BACKEND_URL mis à jour dans frontend/.env${NC}"
  else
    echo -e "${GREEN}✅ Déploiement Railway lancé${NC}"
  fi
else
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  DÉPLOIEMENT MANUEL BACKEND (Railway)${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  1. Va sur https://railway.app"
  echo -e "  2. New Project → Deploy from GitHub"
  echo -e "  3. Sélectionne ton repo → Root: ${GREEN}backend/${NC}"
  echo -e "  4. Variables d'env à ajouter:"
  echo -e "     ${GREEN}FRONTEND_URL=https://ton-app.vercel.app${NC}"
  echo -e "  5. Note l'URL Railway obtenue"
  echo ""

  # Installer Railway CLI
  echo -e "${GOLD}  Ou installe Railway CLI:${NC}"
  echo -e "  ${GREEN}npm install -g @railway/cli${NC}"
  echo -e "  ${GREEN}railway login${NC}"
  echo -e "  ${GREEN}railway init${NC}"
  echo -e "  ${GREEN}bash deploy.sh${NC}"
fi

# ── Déployer Frontend sur Vercel ─────────────────────────────
echo ""
echo -e "${GOLD}[4/4] Frontend → Vercel...${NC}"
if [ "$HAS_VERCEL" = true ]; then
  cd frontend
  vercel --prod --yes 2>&1 | tail -5
  VERCEL_URL=$(vercel ls 2>/dev/null | grep "7wonders" | head -1 | awk '{print $2}' || echo "")
  cd ..
  echo -e "${GREEN}✅ Frontend déployé sur Vercel${NC}"
else
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  DÉPLOIEMENT MANUEL FRONTEND (Vercel)${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  1. Va sur https://vercel.com"
  echo -e "  2. New Project → importe ton repo GitHub"
  echo -e "  3. Root Directory: ${GREEN}frontend/${NC}"
  echo -e "  4. Variable d'env:"
  echo -e "     ${GREEN}VITE_BACKEND_URL=https://ton-backend.railway.app${NC}"
  echo -e "  5. Deploy !"
  echo ""

  echo -e "${GOLD}  Ou installe Vercel CLI:${NC}"
  echo -e "  ${GREEN}npm install -g vercel${NC}"
  echo -e "  ${GREEN}vercel login${NC}"
  echo -e "  ${GREEN}bash deploy.sh${NC}"
fi

# ── Résumé ───────────────────────────────────────────────────
echo ""
echo -e "${GOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${GOLD}║         🎮 DÉPLOIEMENT TERMINÉ !         ║${NC}"
echo -e "${GOLD}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "Rappel des URLs à configurer :"
echo -e "  Backend  → Variable ${GREEN}FRONTEND_URL${NC} sur Railway"
echo -e "  Frontend → Variable ${GREEN}VITE_BACKEND_URL${NC} sur Vercel"
echo ""
