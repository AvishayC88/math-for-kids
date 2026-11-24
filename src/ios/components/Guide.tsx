import type { ReactNode } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Friend, type Mood } from '../../art/Friend';
import { StarIcon } from '../../art/icons';

// The chosen friend (the owl at first) and its speech bubble at the top of every activity.
export function Guide({ mood, children }: { mood: Mood; children: ReactNode }) {
  const friend = useGameStore(state => state.selectedFriend);
  return (
    <section className="shrink-0 flex items-center gap-2.5">
      <Friend friend={friend} mood={mood} size={56} />
      <div className="relative flex-1 min-w-0 min-h-[56px] px-4 py-2 rounded-[20px] bg-card shadow-card flex items-center justify-between gap-3">
        <div aria-hidden="true" className="absolute -right-1.5 top-1/2 -mt-[7px] w-3.5 h-3.5 bg-card rotate-45" />
        {children}
      </div>
    </section>
  );
}

// The bubble's text: the task, a gentle "try again", or the celebration with the stars earned.
export function GuideText({ task, state, feedback, celebration, reward }: {
  task: string;
  state: 'playing' | 'success' | 'error';
  feedback: string | null;
  celebration: string;
  reward?: number;
}) {
  if (state === 'success') {
    return (
      <div role="status" className="relative flex-1 min-w-0 flex flex-col items-start gap-1">
        <p className="text-[19px] font-bold text-success-text">{celebration}</p>
        {!!reward && (
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-star-bg text-star-text text-base font-bold">
            <span dir="ltr">+{reward}</span>
            <StarIcon size={15} />
          </span>
        )}
      </div>
    );
  }
  return (
    <p role={state === 'error' ? 'status' : undefined}
      className={`relative flex-1 min-w-0 text-[17px] leading-snug ${state === 'error' ? 'font-bold text-ink' : 'font-medium text-muted'}`}>
      {state === 'error' && feedback ? feedback : task}
    </p>
  );
}
