# 🏛️ 7 Wonders Online

Jeu de draft multijoueur en ligne, inspiré du jeu de société 7 Wonders.

---

## 📁 Structure du projet

```
7wonders/
├── backend/          ← Serveur Node.js
│   ├── src/
│   │   ├── server.js       ← Point d'entrée du serveur
│   │   ├── gameEngine.js   ← Logique du jeu
│   │   └── cards.js        ← Toutes les cartes et merveilles
│   ├── .env.example
│   └── package.json
├── frontend/         ← Interface React
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── lib/
│   │   │   └── store.js    ← État global (Zustand)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LobbyPage.jsx
│   │   │   ├── GamePage.jsx
│   │   │   └── GameOverPage.jsx
│   │   └── components/
│   │       ├── Card.jsx
│   │       ├── WonderBoard.jsx
│   │       ├── ActionPanel.jsx
│   │       └── Chat.jsx
│   ├── vercel.json
│   └── package.json
├── supabase/
│   └── schema.sql    ← Tables optionnelles
└── package.json
```

---

## 🚀 Lancer le projet en local (étape par étape)

### Prérequis
- Node.js 18+ installé → https://nodejs.org
- Un terminal (Terminal sur Mac, CMD sur Windows)

---

### Étape 1 — Installer les dépendances

```bash
# Dans le dossier 7wonders/
npm run install:all
```

Ou manuellement :
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### Étape 2 — Configurer l'environnement

**Backend :**
```bash
cd backend
cp .env.example .env
# Le fichier .env par défaut fonctionne sans modification
```

**Frontend :**
```bash
cd frontend
cp .env.example .env
# VITE_BACKEND_URL=http://localhost:3001 (déjà configuré)
```

---

### Étape 3 — Démarrer les serveurs

**Terminal 1 — Backend :**
```bash
cd backend
npm run dev
# → Serveur démarré sur http://localhost:3001
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
# → Interface ouverte sur http://localhost:5173
```

---

### Étape 4 — Jouer !

1. Ouvrir http://localhost:5173 dans **2 onglets** (ou 2 navigateurs)
2. Dans l'onglet 1 : entrer un nom → **Créer une partie** → noter le code
3. Dans l'onglet 2 : entrer un nom → **Rejoindre** → saisir le code
4. L'hôte clique sur **Démarrer la partie**

---

## 🌐 Déploiement en ligne (gratuit)

### Backend sur Railway

1. Créer un compte sur https://railway.app
2. Cliquer sur **New Project** → **Deploy from GitHub repo**
3. Connecter ton repo GitHub et sélectionner le dossier `backend/`
4. Variables d'environnement à ajouter dans Railway :
   ```
   FRONTEND_URL=https://ton-app.vercel.app
   ```
5. Railway te donnera une URL comme : `https://7wonders-backend.railway.app`

### Frontend sur Vercel

1. Créer un compte sur https://vercel.com
2. Cliquer sur **New Project** → importer ton repo → sélectionner `frontend/`
3. Variable d'environnement à ajouter dans Vercel :
   ```
   VITE_BACKEND_URL=https://7wonders-backend.railway.app
   ```
4. Cliquer sur **Deploy**

---

## 🎮 Règles du jeu

### But
Construire la civilisation la plus puissante en 3 âges.

### Déroulement d'un tour
1. **Choisir une carte** dans ta main (clic dessus)
2. **Choisir une action** :
   - 🏗️ **Construire** : jouer la carte (payer le coût si nécessaire)
   - 🪙 **Vendre** : défausser pour gagner 3 pièces
   - 🏛️ **Merveille** : utiliser la carte pour construire une étape de ta merveille
3. **Confirmer** → les mains tournent entre joueurs

### Types de cartes
| Type | Couleur | Effet |
|------|---------|-------|
| 🪵 Ressources | Marron/Gris | Produire des matériaux |
| 🏛️ Civil | Bleu | Points de victoire directs |
| ⚔️ Militaire | Rouge | Boucliers pour les combats |
| 🔬 Science | Vert | Points exponentiels |
| 💰 Commerce | Jaune | Pièces et avantages commerciaux |
| 👑 Guildes | Violet | VP basés sur les voisins |

### Combats militaires
À la fin de chaque âge, tu combats tes 2 voisins :
- Victoire (plus de boucliers) : **+1/3/5 VP** selon l'âge
- Défaite : **-1 VP**

### Score final
- VP accumulés (cartes civiles, combats...)
- **Science** : points exponentiels (sets × 7 + carré de chaque symbole)
- **Pièces** : 1 VP par 3 pièces

---

## 🗃️ Supabase (optionnel — pour sauvegarder les parties)

1. Créer un compte sur https://supabase.com
2. Créer un nouveau projet
3. Ouvrir l'éditeur SQL et coller le contenu de `supabase/schema.sql`
4. Exécuter le script
5. Récupérer l'URL et la clé API dans **Settings → API**
6. Ajouter dans le `.env` du backend :
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_KEY=ta_clé_ici
   ```

---

## 🛠️ Technologie utilisée

| Couche | Technologie | Rôle |
|--------|-------------|------|
| Frontend | React + Vite | Interface utilisateur |
| Styles | Tailwind CSS | Design antique doré |
| État | Zustand | Gestion de l'état global |
| Backend | Node.js + Express | API REST |
| Temps réel | Socket.io | WebSocket multijoueur |
| BDD | Supabase (optionnel) | Persistance des données |
| Déploiement | Vercel + Railway | Hébergement gratuit |

---

## ❓ Problèmes fréquents

**Le backend ne démarre pas :**
```bash
# Vérifier que Node.js est bien installé
node --version  # doit afficher v18 ou +
```

**Les joueurs ne se voient pas :**
- Vérifier que le code de partie est correct (majuscules)
- S'assurer que le backend tourne sur le port 3001

**Erreur CORS :**
- Vérifier que `FRONTEND_URL` dans le `.env` du backend correspond bien à l'adresse du frontend
