import { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { GameMode } from '../domain/types';
import { BookIcon, GearIcon } from '../art/icons';
import { palette } from '../art/palette';
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
    <div dir="rtl" className="safe-screen flex flex-col bg-paper">
      <div className="flex-1 min-h-0 w-full max-w-xl mx-auto px-4 py-2 flex flex-col">
        <header className="h-11 shrink-0 flex items-center justify-between">
          <StarsCounter onClick={() => setIsShopOpen(true)} />
          <div className="flex gap-2">
            <IconButton label="ספר המדבקות" onClick={() => setIsShopOpen(true)}><BookIcon color={palette.icon} /></IconButton>
            <IconButton label="הגדרות" onClick={() => setIsSettingsOpen(true)}><GearIcon color={palette.icon} /></IconButton>
          </div>
        </header>

        <nav aria-label="מצבי משחק" className="mt-3 shrink-0 grid grid-cols-3 gap-1 p-1 rounded-2xl bg-track">
          {MODES.map(mode => (
            <button key={mode.id} type="button" onClick={() => setGameMode(mode.id)} aria-pressed={gameMode === mode.id}
              className={`h-11 rounded-xl text-base transition-colors ${
                gameMode === mode.id ? 'bg-card text-accent font-bold shadow-seg' : 'text-muted font-medium'
              }`}>
              {mode.label}
            </button>
          ))}
        </nav>

        <main className="mt-3.5 flex-1 min-h-0 flex flex-col">
          {gameMode === 'build' && <GameScreen />}
          {gameMode === 'recognize' && <RecognizeScreen />}
          {gameMode === 'math' && <MathScreen />}
        </main>
      </div>

      {isSettingsOpen && <SettingsScreen onClose={() => setIsSettingsOpen(false)} />}
      {isShopOpen && <StickerShop onClose={() => setIsShopOpen(false)} />}
    </div>
  );
}
