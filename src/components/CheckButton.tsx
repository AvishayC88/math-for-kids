import { useGameStore } from '../store/useGameStore';

interface Props {
  onCheck: () => void;
  canCheck: boolean;
  nextLabel: string;
  className?: string;
}

// "בדוק אותי!", or after a correct answer a bar that fills during the pause before the next round.
// Both are the same height, so nothing on the page moves.
export function CheckButton({ onCheck, canCheck, nextLabel, className = '' }: Props) {
  const solved = useGameStore(state => state.interactionState === 'success');

  if (solved) {
    return (
      <div className={`h-14 flex flex-col items-center justify-center gap-2.5 ${className}`}>
        <p className="text-base font-medium text-muted">{nextLabel}</p>
        <div className="w-48 h-1.5 rounded-full bg-track overflow-hidden">
          <div className="next-round-bar h-full rounded-full bg-accent" />
        </div>
      </div>
    );
  }

  return (
    <button type="button" onClick={onCheck} disabled={!canCheck}
      className={`h-14 rounded-[18px] bg-accent text-white text-xl font-bold shadow-press transition-transform enabled:hover:brightness-110 enabled:active:translate-y-0.5 disabled:bg-track disabled:text-muted disabled:shadow-none ${className}`}>
      בדוק אותי!
    </button>
  );
}
