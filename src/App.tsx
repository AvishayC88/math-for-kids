import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { GameScreen } from './components/GameScreen';
import { RecognizeScreen } from './components/RecognizeScreen';

export default function App() {
  const initGame = useGameStore((state) => state.initGame);
  const gameMode = useGameStore((state) => state.gameMode);
  const setGameMode = useGameStore((state) => state.setGameMode);

  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {/* Navigation Bar */}
      <div className="bg-white border-b-2 border-gray-100 p-2 flex justify-center gap-2 sm:gap-4 shrink-0 z-50">
        <button
          onClick={() => setGameMode('build')}
          className={`px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-colors ${
            gameMode === 'build' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          בניית מספר
        </button>
        <button
          onClick={() => setGameMode('recognize')}
          className={`px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-colors ${
            gameMode === 'recognize' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          זיהוי מספר
        </button>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 min-h-0 relative">
        {gameMode === 'build' ? <GameScreen /> : <RecognizeScreen />}
      </div>
    </div>
  );
}