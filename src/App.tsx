import { useEffect, useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { GameScreen } from './components/GameScreen';
import { RecognizeScreen } from './components/RecognizeScreen';
import { MathScreen } from './components/MathScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { StickerShop } from './components/StickerShop';
import { StarsCounter } from './components/StarsCounter';

export default function App() {
  const initGame = useGameStore((state) => state.initGame);
  const gameMode = useGameStore((state) => state.gameMode);
  const setGameMode = useGameStore((state) => state.setGameMode);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-gray-50">
      
      {/* Navigation Bar */}
      <div className="bg-white border-b-2 border-gray-100 p-2 flex justify-between items-center shrink-0 z-50 shadow-sm relative">
        
        {/* Left Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-lg sm:text-xl"
            aria-label="Settings"
          >
            ⚙️
          </button>
          
          <button
            onClick={() => setIsShopOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-pink-100 hover:bg-pink-200 transition-colors text-lg sm:text-xl border border-pink-200 shadow-sm"
            aria-label="Sticker Shop"
          >
            📖
          </button>
        </div>

        {/* Center: Game Modes */}
        <div className="flex justify-center gap-1 sm:gap-2 absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => setGameMode('build')}
            className={`px-2 sm:px-4 py-2 rounded-full font-bold text-[10px] sm:text-sm transition-colors ${
              gameMode === 'build' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'
            }`}
          >
            בנייה
          </button>
          <button
            onClick={() => setGameMode('recognize')}
            className={`px-2 sm:px-4 py-2 rounded-full font-bold text-[10px] sm:text-sm transition-colors ${
              gameMode === 'recognize' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'
            }`}
          >
            זיהוי
          </button>
          <button
            onClick={() => setGameMode('math')}
            className={`px-2 sm:px-4 py-2 rounded-full font-bold text-[10px] sm:text-sm transition-colors ${
              gameMode === 'math' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'
            }`}
          >
            תרגילים
          </button>
        </div>

        {/* Right Side: Stars Counter */}
        <StarsCounter onClick={() => setIsShopOpen(true)} />
        
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative">
        {gameMode === 'build' && <GameScreen />}
        {gameMode === 'recognize' && <RecognizeScreen />}
        {gameMode === 'math' && <MathScreen />}
      </div>

      {/* Overlays */}
      {isSettingsOpen && <SettingsScreen onClose={() => setIsSettingsOpen(false)} />}
      {isShopOpen && <StickerShop onClose={() => setIsShopOpen(false)} />}
      
    </div>
  );
}