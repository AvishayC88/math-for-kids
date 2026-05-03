import { useGameStore } from '../store/useGameStore';

interface Props {
  onClose: () => void;
}

// ARCHITECT NOTE: Abstracted catalog to allow easy expansion later
const STICKER_CATALOG = [
  { id: 's1', emoji: '👑', name: 'כתר נסיכה', cost: 50 },
  { id: 's2', emoji: '🦄', name: 'חד קרן', cost: 80 },
  { id: 's3', emoji: '🪄', name: 'שרביט קסמים', cost: 100 },
  { id: 's4', emoji: '🎀', name: 'הפפיון של גבי', cost: 120 },
  { id: 's5', emoji: '🐱', name: 'פנדי פוש', cost: 150 },
  { id: 's6', emoji: '🧚‍♀️', name: 'פיה קסומה', cost: 200 },
  { id: 's7', emoji: '🌈', name: 'קשת בענן', cost: 250 },
  { id: 's8', emoji: '🏰', name: 'הטירה הגדולה', cost: 300 },
];

export function StickerShop({ onClose }: Props) {
  const coinsCollected = useGameStore((state) => state.coinsCollected);
  const unlockedStickers = useGameStore((state) => state.unlockedStickers);
  const buySticker = useGameStore((state) => state.buySticker);

  return (
    <div className="fixed inset-0 bg-pink-50 z-[100] flex flex-col font-sans select-none" dir="rtl">
      
      {/* Header */}
      <div className="bg-white border-b-2 border-pink-200 p-4 flex justify-between items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-extrabold text-pink-600">ספר המדבקות</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
            <span className="font-bold text-yellow-700 text-lg">{coinsCollected}</span>
            <span className="text-yellow-600">⭐</span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-xl hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-20">
          
          {STICKER_CATALOG.map((sticker) => {
            const isUnlocked = unlockedStickers.includes(sticker.id);
            const canAfford = coinsCollected >= sticker.cost;

            return (
              <div 
                key={sticker.id}
                className={`relative flex flex-col items-center p-4 rounded-3xl border-4 transition-all ${
                  isUnlocked 
                    ? 'bg-white border-green-400 shadow-md scale-100' 
                    : 'bg-white border-pink-100 shadow-sm'
                }`}
              >
                <div className="text-5xl sm:text-6xl mb-2 drop-shadow-sm">
                  {isUnlocked ? sticker.emoji : <span className="opacity-40 grayscale">{sticker.emoji}</span>}
                </div>
                <span className="font-bold text-gray-700 text-sm sm:text-base text-center mb-2">
                  {sticker.name}
                </span>

                {isUnlocked ? (
                  <div className="mt-auto px-4 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                    שלי! ✅
                  </div>
                ) : (
                  <button
                    onClick={() => buySticker(sticker.id, sticker.cost)}
                    disabled={!canAfford}
                    className={`mt-auto px-4 py-2 rounded-full font-bold w-full flex items-center justify-center gap-1 transition-all ${
                      canAfford 
                        ? 'bg-pink-500 hover:bg-pink-600 text-white active:scale-95 shadow-md cursor-pointer' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{sticker.cost}</span>
                    <span className="text-xs">⭐</span>
                  </button>
                )}
              </div>
            );
          })}
          
        </div>
      </div>
    </div>
  );
}