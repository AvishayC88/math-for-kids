import { useEffect, useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { GameScreen } from './components/GameScreen';
import { RecognizeScreen } from './components/RecognizeScreen';
import { SettingsScreen } from './components/SettingsScreen';

export default function App() {
  const initGame = useGameStore((state) => state.initGame);
  const gameMode = useGameStore((state) => state.gameMode);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const coinsCollected = useGameStore((state) => state.coinsCollected);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-gray-50">
      
      {/* Navigation Bar */}
      <div className="bg-white border-b-2 border-gray-100 p-2 flex justify-between items-center shrink-0 z-50 shadow-sm relative">
        
        {/* Left: Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-xl"
          aria-label="Settings"
        >
          ⚙️
        </button>

        {/* Center: Game Modes */}
        <div className="flex justify-center gap-1 sm:gap-4 absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => setGameMode('build')}
            className={`px-3 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-base transition-colors ${
              gameMode === 'build' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            בניית מספר
          </button>
          <button
            onClick={() => setGameMode('recognize')}
            className={`px-3 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-base transition-colors ${
              gameMode === 'recognize' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            זיהוי מספר
          </button>
        </div>

        {/* Right: Coins (Visual balancing) */}
        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
          <span className="font-bold text-yellow-700 text-sm">{coinsCollected}</span>
          <span className="text-yellow-600">🪙</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 min-h-0 relative">
        {gameMode === 'build' ? <GameScreen /> : <RecognizeScreen />}
      </div>

      {/* Settings Overlay */}
      {isSettingsOpen && (
        <SettingsScreen onClose={() => setIsSettingsOpen(false)} />
      )}
      
    </div>
  );
}