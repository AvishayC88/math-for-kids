import { useGameStore, SKIP_COST } from '../../store/useGameStore';
import { StarIcon } from '../../art/icons';

// Pay stars to get a different problem. A quiet link, so it never competes with "בדוק אותי!".
// The price lives in the store (SKIP_COST).
export function SkipButton({ label }: { label: string }) {
  const coinsCollected = useGameStore(state => state.coinsCollected);
  const skipProblem = useGameStore(state => state.skipProblem);
  const canAfford = coinsCollected >= SKIP_COST;

  return (
    <button type="button" onClick={skipProblem} disabled={!canAfford}
      aria-label={canAfford ? `${label}, עולה ${SKIP_COST} כוכבים` : `${label}: צריך ${SKIP_COST} כוכבים`}
      className="mt-0.5 h-11 flex items-center justify-center gap-1.5 text-[15px] font-medium text-muted disabled:opacity-50">
      <span>{label} · {SKIP_COST}</span>
      <StarIcon size={14} />
    </button>
  );
}
