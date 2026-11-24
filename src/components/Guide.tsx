import type { ReactNode } from 'react';
import { Owl, type Mood } from '../art/Owl';
import { StarIcon } from '../art/icons';

// The owl and its speech bubble above every activity.
export function Guide({ mood, children }: { mood: Mood; children: ReactNode }) {
  return (
    <section className="self-center max-w-full flex items-center gap-2.5 sm:gap-3">
      <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0"><Owl mood={mood} size="100%" /></div>
      <div className="relative min-w-0 min-h-[64px] px-4 sm:px-7 py-2 rounded-[22px] bg-card shadow-card flex items-center gap-3 sm:gap-7">
        <div aria-hidden="true" className="absolute -right-[7px] top-1/2 -mt-2 w-4 h-4 bg-card rotate-45" />
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
      <div role="status" className="relative min-w-0 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
        <p className="text-[21px] font-bold text-success-text">{celebration}</p>
        {!!reward && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-star-bg text-star-text text-[17px] font-bold">
            <span dir="ltr">+{reward}</span>
            <StarIcon size={16} />
          </span>
        )}
      </div>
    );
  }
  return (
    <p role={state === 'error' ? 'status' : undefined}
      className={`relative min-w-0 text-[clamp(16px,4vw,20px)] leading-snug ${state === 'error' ? 'font-bold text-ink' : 'font-medium text-muted'}`}>
      {state === 'error' && feedback ? feedback : task}
    </p>
  );
}
