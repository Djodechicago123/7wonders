// App.jsx - Routeur principal
import { useGameStore } from './lib/store';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import GameOverPage from './pages/GameOverPage';

export default function App() {
  const { phase } = useGameStore();

  switch (phase) {
    case 'lobby':    return <LobbyPage />;
    case 'game':     return <GamePage />;
    case 'gameover': return <GameOverPage />;
    default:         return <HomePage />;
  }
}
