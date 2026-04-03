// App.jsx - Routeur principal
import { useEffect, useState } from 'react';
import { useGameStore } from './lib/store';
import { useAuthStore } from './lib/auth';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import GameOverPage from './pages/GameOverPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';

export default function App() {
  const { phase } = useGameStore();
  const { user, loading, loadProfile } = useAuthStore();
  const [page, setPage] = useState(null); // 'profile' | 'leaderboard' | null

  useEffect(() => { loadProfile(); }, []);

  // Spinner pendant la vérification du token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#1a1208' }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">⚙️</div>
          <p className="font-display text-gold-400 tracking-widest">CHARGEMENT...</p>
        </div>
      </div>
    );
  }

  // Pages flottantes (profil / classement) — disponibles partout sauf pendant la partie
  if (page === 'profile' && phase !== 'game') {
    return <ProfilePage onBack={() => setPage(null)} />;
  }
  if (page === 'leaderboard' && phase !== 'game') {
    return <LeaderboardPage onBack={() => setPage(null)} />;
  }

  // Auth obligatoire
  if (!user) return <AuthPage />;

  switch (phase) {
    case 'lobby':
      return <LobbyPage onProfile={() => setPage('profile')} onLeaderboard={() => setPage('leaderboard')} />;
    case 'game':
      return <GamePage />;
    case 'gameover':
      return <GameOverPage onProfile={() => setPage('profile')} onLeaderboard={() => setPage('leaderboard')} />;
    default:
      return <HomePage onProfile={() => setPage('profile')} onLeaderboard={() => setPage('leaderboard')} />;
  }
}
