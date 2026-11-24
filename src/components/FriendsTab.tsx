import { useGameStore } from '../store/useGameStore';
import { FRIENDS } from '../domain/friends';
import { Friend } from '../art/Friend';
import { CheckIcon, StarIcon } from '../art/icons';
import { palette } from '../art/palette';

// The sticker book's second tab: friends to buy with stars, and the one who guides the game.
export function FriendsTab() {
  const ownedFriends = useGameStore(state => state.ownedFriends);
  const selectedFriend = useGameStore(state => state.selectedFriend);
  const coinsCollected = useGameStore(state => state.coinsCollected);
  const buyFriend = useGameStore(state => state.buyFriend);
  const selectFriend = useGameStore(state => state.selectFriend);

  return (
    <>
      <p className="text-center text-[17px] font-medium text-muted">בחרו חבר שילווה אתכם במשחק</p>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {FRIENDS.map(friend => {
          const owned = ownedFriends.includes(friend.id);
          const selected = selectedFriend === friend.id;
          const missing = friend.cost - coinsCollected;
          return (
            <div key={friend.id}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-[22px] bg-card shadow-card ${selected ? 'ring-2 ring-accent' : ''}`}>
              <div className="w-24 h-24 rounded-full bg-halo flex items-center justify-center">
                <Friend friend={friend.id} size={84} />
              </div>
              <p className="text-lg font-bold">{friend.name}</p>
              {selected ? (
                <span className="h-11 w-[min(220px,100%)] rounded-[14px] bg-accent-soft text-accent-dark text-[15px] font-bold flex items-center justify-center gap-1.5">
                  <CheckIcon size={16} color={palette.accent.dark} />
                  החבר שלי
                </span>
              ) : owned ? (
                <button type="button" onClick={() => selectFriend(friend.id)} aria-label={`בחירת ${friend.name}`}
                  className="h-11 w-[min(220px,100%)] rounded-[14px] bg-card text-accent text-[15px] font-bold ring-2 ring-inset ring-accent transition hover:bg-accent-soft active:translate-y-0.5">
                  בחירה
                </button>
              ) : missing <= 0 ? (
                <button type="button" onClick={() => buyFriend(friend.id)} aria-label={`קניית ${friend.name} ב-${friend.cost} כוכבים`}
                  className="h-11 w-[min(220px,100%)] rounded-[14px] bg-accent text-white font-bold flex items-center justify-center gap-1.5 shadow-press transition hover:brightness-110 active:translate-y-0.5">
                  <span>{friend.cost}</span>
                  <StarIcon size={16} color="#FFD54A" />
                </button>
              ) : (
                <button type="button" disabled aria-label={`${friend.name} עולה ${friend.cost} כוכבים, חסרים עוד ${missing}`}
                  className="h-11 w-[min(220px,100%)] rounded-[14px] bg-track text-muted font-bold flex items-center justify-center gap-1.5">
                  <span>עוד {missing}</span>
                  <StarIcon size={16} color="#D9A400" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
