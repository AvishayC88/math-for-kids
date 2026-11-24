import { useGameStore, SKIP_COST } from '../store/useGameStore';
import { StarIcon } from '../art/icons';

// Pay stars to get a different problem. A quiet link, so it never competes with "בדוק אותי!".
// Hidden (keeping its space) while a correct answer is celebrated. The price lives in the store.
export function SkipButton({ label }: { label: string }) {
  const coinsCollected = useGameStore(state => state.coinsCollected);
  const solved = useGameStore(state => state.interactionState === 'success');
  const skipProblem = useGameStore(state => state.skipProblem);
  const canAfford = coinsCollected >= SKIP_COST;

  return (
    <button type="button" onClick={skipProblem} disabled={!canAfford || solved}
      aria-label={canAfford ? `${label}, עולה ${SKIP_COST} כוכבים` : `${label}: צריך ${SKIP_COST} כוכבים`}
      className={`h-11 px-2 flex items-center justify-center gap-1.5 text-[15px] font-medium text-muted enabled:hover:text-ink disabled:opacity-50 ${solved ? 'invisible' : ''}`}>
      <span>{label} · {SKIP_COST}</span>
      <StarIcon size={14} />
    </button>
  );
}
