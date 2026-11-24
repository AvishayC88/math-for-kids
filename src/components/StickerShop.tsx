import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { STICKER_CATALOG } from '../domain/stickers';
import { CheckIcon, CloseIcon, StarIcon } from '../art/icons';
import { palette } from '../art/palette';
import { StarsCounter } from './StarsCounter';
import { IconButton } from './IconButton';
import { FriendsTab } from './FriendsTab';

const TABS = [
  { id: 'stickers', label: 'מדבקות' },
  { id: 'friends', label: 'חברים' },
] as const;

// The sticker book: stickers to collect, and friends who guide the game.
export function StickerShop({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'stickers' | 'friends'>('stickers');

  return (
    <div dir="rtl" className="fixed inset-0 z-[100] bg-paper overflow-y-auto overscroll-contain">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-10">
        <header className="h-11 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex"><StarsCounter /></div>
          <h1 className="text-xl sm:text-2xl font-bold">ספר המדבקות</h1>
          <div className="flex justify-end">
            <IconButton label="סגירת ספר המדבקות" onClick={onClose}><CloseIcon color={palette.icon} /></IconButton>
          </div>
        </header>

        <nav aria-label="חלקי הספר" className="mt-4 mx-auto w-[min(360px,100%)] grid grid-cols-2 gap-1 p-1 rounded-2xl bg-track">
          {TABS.map(item => (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} aria-pressed={tab === item.id}
              className={`h-11 rounded-xl text-base transition-colors ${
                tab === item.id ? 'bg-card text-accent font-bold shadow-seg' : 'text-muted font-medium hover:text-ink'
              }`}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-5">
          {tab === 'friends' ? <FriendsTab /> : <StickerGrid />}
        </div>
      </div>
    </div>
  );
}

function StickerGrid() {
  const unlockedStickers = useGameStore(state => state.unlockedStickers);
  const coinsCollected = useGameStore(state => state.coinsCollected);
  const buySticker = useGameStore(state => state.buySticker);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {STICKER_CATALOG.map(sticker => {
        const owned = unlockedStickers.includes(sticker.id);
        const missing = sticker.cost - coinsCollected;
        return (
          <div key={sticker.id}
            className={`flex flex-col items-center gap-2 p-4 rounded-[22px] bg-card shadow-card ${owned ? 'ring-2 ring-success-line' : ''}`}>
            <div className="w-20 h-20 rounded-full bg-halo flex items-center justify-center text-[48px]">
              <span className={owned ? '' : 'opacity-40 grayscale'}>{sticker.emoji}</span>
            </div>
            <p className="min-h-[2.5em] flex items-center text-center text-base font-bold leading-tight">{sticker.name}</p>
            {owned ? (
              <span className="h-11 w-full rounded-[14px] bg-success-bg text-success-text font-bold flex items-center justify-center gap-1.5">
                <CheckIcon size={16} color={palette.success.text} />
                שלי!
              </span>
            ) : missing <= 0 ? (
              <button type="button" onClick={() => buySticker(sticker.id, sticker.cost)} aria-label={`קנייה ב-${sticker.cost} כוכבים`}
                className="h-11 w-full rounded-[14px] bg-accent text-white font-bold flex items-center justify-center gap-1.5 shadow-press transition hover:brightness-110 active:translate-y-0.5">
                <span>{sticker.cost}</span>
                <StarIcon size={16} color="#FFD54A" />
              </button>
            ) : (
              <button type="button" disabled aria-label={`עולה ${sticker.cost} כוכבים, חסרים עוד ${missing}`}
                className="h-11 w-full rounded-[14px] bg-track text-muted font-bold flex items-center justify-center gap-1.5">
                <span>עוד {missing}</span>
                <StarIcon size={16} color="#D9A400" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
