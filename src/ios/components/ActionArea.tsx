import { useGameStore } from '../../store/useGameStore';
import { SkipButton } from './SkipButton';

interface Props {
  onCheck: () => void;
  canCheck: boolean;
  skipLabel: string;
  nextLabel: string;
}

// The main button and the skip link. After a correct answer both make way for a bar that fills
// during the pause before the next round, at the same height, so nothing on the screen moves.
export function ActionArea({ onCheck, canCheck, skipLabel, nextLabel }: Props) {
  const solved = useGameStore(state => state.interactionState === 'success');

  if (solved) {
    return (
      <div className="mt-3.5 h-[102px] shrink-0 flex flex-col items-center justify-center gap-2.5">
        <p className="text-base font-medium text-muted">{nextLabel}</p>
        <div className="w-44 h-1.5 rounded-full bg-track overflow-hidden">
          <div className="next-round-bar h-full rounded-full bg-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3.5 shrink-0 flex flex-col">
      <button type="button" onClick={onCheck} disabled={!canCheck}
        className="h-14 rounded-[18px] bg-accent text-white text-xl font-bold shadow-press transition-transform enabled:active:translate-y-0.5 disabled:bg-track disabled:text-muted disabled:shadow-none">
        בדוק אותי!
      </button>
      <SkipButton label={skipLabel} />
    </div>
  );
}
