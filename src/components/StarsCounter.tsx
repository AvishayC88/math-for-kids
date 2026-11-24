import { useGameStore } from '../store/useGameStore';
import { StarIcon } from '../art/icons';

const LOOK = 'h-11 px-4 rounded-full bg-star-bg text-star-text text-[17px] font-bold flex items-center gap-1.5';

// The star count. With onClick it opens the sticker book.
export function StarsCounter({ onClick }: { onClick?: () => void }) {
  const coinsCollected = useGameStore(state => state.coinsCollected);
  const content = <><span>{coinsCollected}</span><StarIcon size={18} /></>;

  return onClick
    ? <button type="button" onClick={onClick} aria-label={`${coinsCollected} כוכבים, פתיחת ספר המדבקות`} className={`${LOOK} hover:brightness-95`}>{content}</button>
    : <span aria-label={`${coinsCollected} כוכבים`} className={LOOK}>{content}</span>;
}
