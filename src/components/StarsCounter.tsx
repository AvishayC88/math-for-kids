import { useGameStore } from '../store/useGameStore';

interface Props {
  onClick?: () => void;
}

export function StarsCounter({ onClick }: Props) {
  const coinsCollected = useGameStore((state) => state.coinsCollected);

  return (
    // ARCHITECT FIX: Locked dir="ltr" ensures the star is ALWAYS on the right of the number, immune to parent RTL rules.
    <div 
      onClick={onClick}
      dir="ltr"
      className={`flex items-center gap-1 bg-yellow-100 px-2 sm:px-3 py-1 rounded-full border border-yellow-200 ${
        onClick ? 'cursor-pointer hover:bg-yellow-200 transition-colors' : ''
      }`}
    >
      <span className="font-bold text-yellow-700 text-xs sm:text-base">{coinsCollected}</span>
      <span className="text-yellow-600 text-xs sm:text-base">⭐</span>
    </div>
  );
}