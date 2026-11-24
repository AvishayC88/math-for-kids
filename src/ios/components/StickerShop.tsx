import { useGameStore } from '../../store/useGameStore';
import { STICKER_CATALOG } from '../../domain/stickers';
import { CheckIcon, CloseIcon, StarIcon } from '../../art/icons';
import { palette } from '../../art/palette';
import { StarsCounter } from './StarsCounter';
import { IconButton } from './IconButton';

export function StickerShop({ onClose }: { onClose: () => void }) {
  const unlockedStickers = useGameStore(state => state.unlockedStickers);
  const coinsCollected = useGameStore(state => state.coinsCollected);
  const buySticker = useGameStore(state => state.buySticker);

  return (
    <div dir="rtl" className="safe-screen fixed inset-0 z-[100] bg-paper flex flex-col">
      <div className="flex-1 min-h-0 w-full max-w-xl mx-auto px-4 py-2 flex flex-col">
        <header className="h-11 shrink-0 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex"><StarsCounter /></div>
          <h1 className="text-xl font-bold">ספר המדבקות</h1>
          <div className="flex justify-end">
            <IconButton label="סגירת ספר המדבקות" onClick={onClose}><CloseIcon color={palette.icon} /></IconButton>
          </div>
        </header>

        <div className="mt-4 flex-1 min-h-0 overflow-y-auto overscroll-contain -mx-4 px-4 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STICKER_CATALOG.map(sticker => {
              const owned = unlockedStickers.includes(sticker.id);
              const missing = sticker.cost - coinsCollected;
              return (
                <div key={sticker.id}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-[20px] bg-card shadow-card ${owned ? 'ring-2 ring-success-line' : ''}`}>
                  <div className="w-[72px] h-[72px] rounded-full bg-halo flex items-center justify-center text-[44px]">
                    <span className={owned ? '' : 'opacity-40 grayscale'}>{sticker.emoji}</span>
                  </div>
                  <p className="min-h-[2.5em] flex items-center text-center text-[15px] font-bold leading-tight">{sticker.name}</p>
                  {owned ? (
                    <span className="h-11 w-full rounded-[14px] bg-success-bg text-success-text font-bold flex items-center justify-center gap-1.5">
                      <CheckIcon size={16} color={palette.success.text} />
                      שלי!
                    </span>
                  ) : missing <= 0 ? (
                    <button type="button" onClick={() => buySticker(sticker.id, sticker.cost)} aria-label={`קנייה ב-${sticker.cost} כוכבים`}
                      className="h-11 w-full rounded-[14px] bg-accent text-white font-bold flex items-center justify-center gap-1.5 shadow-press transition-transform active:translate-y-0.5">
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
        </div>
      </div>
    </div>
  );
}
