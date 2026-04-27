import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { GameScreen } from './components/GameScreen';

export default function App() {
  const initGame = useGameStore((state) => state.initGame);

  useEffect(() => {
    initGame();
  }, [initGame]);

  return <GameScreen />;
}
