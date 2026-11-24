import { useEffect, useState } from 'react';
import { useGameStore } from './store/useGameStore';
import type { GameMode } from './domain/types';
import { BookIcon, GearIcon } from './art/icons';
import { palette } from './art/palette';
import { GameScreen } from './components/GameScreen';
import { RecognizeScreen } from './components/RecognizeScreen';
import { MathScreen } from './components/MathScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { StickerShop } from './components/StickerShop';
import { StarsCounter } from './components/StarsCounter';
import { IconButton } from './components/IconButton';

const MODES: { id: GameMode; label: string }[] = [
  { id: 'build', label: 'בנייה' },
  { id: 'recognize', label: 'זיהוי' },
  { id: 'math', label: 'תרגילים' },
];

export default function App() {
  const initGame = useGameStore(state => state.initGame);
  const gameMode = useGameStore(state => state.gameMode);
  const setGameMode = useGameStore(state => state.setGameMode);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  useEffect(() => { initGame(); }, [initGame]);

  return (
    <div dir="rtl" className="min-h-[100dvh] bg-paper px-4 sm:px-6 pt-4 sm:pt-6 pb-7">
      {/* Wide screens: stars | modes | icons in one row. Phones: stars and icons, then the modes below. */}
      <header className="max-w-[1232px] mx-auto grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_minmax(0,440px)_1fr] items-center gap-3">
        <div className="flex"><StarsCounter onClick={() => setIsShopOpen(true)} /></div>
        <nav aria-label="מצבי משחק"
          className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-1 sm:col-start-2 grid grid-cols-3 gap-1 p-1 rounded-2xl bg-track">
          {MODES.map(mode => (
            <button key={mode.id} type="button" onClick={() => setGameMode(mode.id)} aria-pressed={gameMode === mode.id}
              className={`h-11 rounded-xl text-base transition-colors ${
                gameMode === mode.id ? 'bg-card text-accent font-bold shadow-seg' : 'text-muted font-medium hover:text-ink'
              }`}>
              {mode.label}
            </button>
          ))}
        </nav>
        <div className="col-start-2 row-start-1 sm:col-start-3 flex justify-end gap-2">
          <IconButton label="ספר המדבקות" onClick={() => setIsShopOpen(true)}><BookIcon color={palette.icon} /></IconButton>
          <IconButton label="הגדרות" onClick={() => setIsSettingsOpen(true)}><GearIcon color={palette.icon} /></IconButton>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto mt-5 flex flex-col">
        {gameMode === 'build' && <GameScreen />}
        {gameMode === 'recognize' && <RecognizeScreen />}
        {gameMode === 'math' && <MathScreen />}
      </main>

      {isSettingsOpen && <SettingsScreen onClose={() => setIsSettingsOpen(false)} />}
      {isShopOpen && <StickerShop onClose={() => setIsShopOpen(false)} />}
    </div>
  );
}
