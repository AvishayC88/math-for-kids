// The friends that can guide the game. Ids are stored in saved progress: never reuse or rename one.
export type FriendId = 'owl' | 'fox' | 'bunny' | 'cat' | 'penguin' | 'panda';

export const DEFAULT_FRIEND: FriendId = 'owl';

// Ordered by price, like the stickers. The owl is free and always owned.
export const FRIENDS: { id: FriendId; name: string; cost: number }[] = [
  { id: 'owl', name: 'ינשוף', cost: 0 },
  { id: 'fox', name: 'שועל', cost: 100 },
  { id: 'bunny', name: 'ארנבת', cost: 150 },
  { id: 'cat', name: 'חתולה', cost: 150 },
  { id: 'penguin', name: 'פינגווין', cost: 250 },
  { id: 'panda', name: 'פנדה', cost: 300 },
];
