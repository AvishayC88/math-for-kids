import { useGameStore, SKIP_COST } from '../../store/useGameStore';

interface Props {
  label: string;
  className?: string;
}

// Pay stars to get a different problem. The price lives in the store (SKIP_COST).
export function SkipButton({ label, className = '' }: Props) {
  const coinsCollected = useGameStore((state) => state.coinsCollected);
  const solved = useGameStore((state) => state.interactionState === 'success');
  const skipProblem = useGameStore((state) => state.skipProblem);
  const canAfford = coinsCollected >= SKIP_COST;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <button
        onClick={skipProblem}
        disabled={!canAfford || solved}
        className={`w-full py-3 rounded-2xl font-bold text-lg transition-all border-2 ${
          canAfford && !solved
            ? 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100 active:scale-95 cursor-pointer'
            : 'bg-gray-50 text-gray-400 border-gray-200 opacity-80 cursor-not-allowed'
        }`}
      >
        {label} (עולה {SKIP_COST} ⭐)
      </button>

      {!canAfford && !solved && (
        <span className="text-xs font-bold text-red-500 text-center px-2 animate-pulse mt-1">
          אין מספיק כוכבים! שחקו במסכים אחרים כדי להרוויח עוד.
        </span>
      )}
    </div>
  );
}
