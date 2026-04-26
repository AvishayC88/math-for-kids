import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';

// Main layout shell
export default function App() {
  const initGame = useGameStore((state) => state.initGame);

  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">
        System Infrastructure Ready
      </h1>
    </div>
  );
}
