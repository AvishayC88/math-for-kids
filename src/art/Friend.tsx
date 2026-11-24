import type { ReactNode } from 'react';
import { FRIENDS, type FriendId } from '../domain/friends';
import { palette } from './palette';

// idle: introduces a task. asks: head tilted, waiting for an answer.
// happy: correct answer. encourage: gentle "try again".
export type Mood = 'idle' | 'asks' | 'happy' | 'encourage';

const INK = palette.ink;
const BLUSH = '#F4A9B8';
const OWL = '#8B6A4F';
const OWL_WING = '#7A5B42';

interface Art {
  base: ReactNode;               // everything behind the eyes, in a 64×64 drawing
  eyes: [number, number][];      // eye centres
  eye: 'owl' | 'dot' | 'oval' | 'panda';
  size: number;                  // pupil radius
  front?: ReactNode;             // nose or beak, drawn over the eyes' row
  smile?: string;                // drawn when happy
  blush: [number, number][];     // cheeks, shown when encouraging
}

// Every friend follows the same plan, so the moods only change the eyes and a small decoration.
const ART: Record<FriendId, Art> = {
  owl: {
    base: <>
      <path d="M14 24 L17 9 L27 18 Z" fill={OWL} /><path d="M50 24 L47 9 L37 18 Z" fill={OWL} />
      <ellipse cx="32" cy="38" rx="22" ry="22" fill={OWL} /><ellipse cx="32" cy="45" rx="13" ry="13" fill="#EAD7BF" />
    </>,
    eyes: [[24, 31], [40, 31]], eye: 'owl', size: 4,
    front: <path d="M29 38 L35 38 L32 43 Z" fill="#F59E0B" />,
    blush: [[17, 41], [47, 41]],
  },
  fox: {
    base: <>
      <path d="M12 28 L15 6 L30 18 Z" fill="#E8772E" /><path d="M52 28 L49 6 L34 18 Z" fill="#E8772E" />
      <path d="M16 23 L18 12 L25 18 Z" fill="#7A3A12" /><path d="M48 23 L46 12 L39 18 Z" fill="#7A3A12" />
      <ellipse cx="32" cy="37" rx="22" ry="20" fill="#E8772E" />
      <path d="M10 40 Q21 35 32 46 Q43 35 54 40 Q47 58 32 58 Q17 58 10 40 Z" fill="#FFF6EC" />
    </>,
    eyes: [[24, 34], [40, 34]], eye: 'dot', size: 3.5,
    front: <ellipse cx="32" cy="46" rx="3.5" ry="2.6" fill={INK} />,
    smile: 'M28.5 50.5 Q32 54 35.5 50.5',
    blush: [[17, 44], [47, 44]],
  },
  bunny: {
    base: <>
      <ellipse cx="23" cy="15" rx="6" ry="14" fill="#F1EDF6" stroke="#BFB3D3" strokeWidth="1.6" />
      <ellipse cx="41" cy="15" rx="6" ry="14" fill="#F1EDF6" stroke="#BFB3D3" strokeWidth="1.6" />
      <ellipse cx="23" cy="16" rx="2.8" ry="9.5" fill="#F4B8C8" /><ellipse cx="41" cy="16" rx="2.8" ry="9.5" fill="#F4B8C8" />
      <circle cx="32" cy="41" r="20" fill="#F1EDF6" stroke="#BFB3D3" strokeWidth="1.6" />
      <circle cx="20" cy="46" r="3" fill="#F8C9D5" /><circle cx="44" cy="46" r="3" fill="#F8C9D5" />
    </>,
    eyes: [[25, 39], [39, 39]], eye: 'dot', size: 3,
    front: <path d="M30 45 L34 45 L32 47.5 Z" fill="#E87D99" />,
    smile: 'M29.5 49.5 Q32 52 34.5 49.5',
    blush: [[20, 46], [44, 46]],
  },
  cat: {
    base: <>
      <path d="M12 30 L14 8 L30 20 Z" fill="#9AA3B5" /><path d="M52 30 L50 8 L34 20 Z" fill="#9AA3B5" />
      <path d="M16 25 L17 14 L25 20 Z" fill="#F4B8C8" /><path d="M48 25 L47 14 L39 20 Z" fill="#F4B8C8" />
      <ellipse cx="32" cy="38" rx="22" ry="20" fill="#9AA3B5" />
      <ellipse cx="32" cy="46" rx="9" ry="6" fill="#E6E9F0" />
    </>,
    eyes: [[24, 35], [40, 35]], eye: 'oval', size: 3,
    front: <>
      <path d="M30 43 L34 43 L32 45.5 Z" fill="#E87D99" />
      <path d="M6 44 L20 46 M6 49 L20 48 M58 44 L44 46 M58 49 L44 48" stroke="#5F6A80" strokeWidth="1.2" strokeLinecap="round" />
    </>,
    smile: 'M29 48 Q32 50.5 35 48',
    blush: [[17, 43], [47, 43]],
  },
  penguin: {
    base: <>
      <ellipse cx="32" cy="36" rx="22" ry="24" fill="#2E3A59" />
      <path d="M14 36 Q14 22 32 27 Q50 22 50 36 Q50 56 32 56 Q14 56 14 36 Z" fill="#FFFFFF" />
      <circle cx="20" cy="43" r="3" fill="#F8C9D5" /><circle cx="44" cy="43" r="3" fill="#F8C9D5" />
    </>,
    eyes: [[25, 35], [39, 35]], eye: 'dot', size: 3.5,
    front: <path d="M28 41 L36 41 L32 46 Z" fill="#F59E0B" />,
    blush: [[20, 43], [44, 43]],
  },
  panda: {
    base: <>
      <circle cx="15" cy="18" r="8" fill="#2B2B33" /><circle cx="49" cy="18" r="8" fill="#2B2B33" />
      <circle cx="32" cy="37" r="22" fill="#FFFFFF" stroke="#CFCAD6" strokeWidth="1.5" />
      <ellipse cx="23.5" cy="35" rx="5.5" ry="6.5" fill="#2B2B33" transform="rotate(-25 23.5 35)" />
      <ellipse cx="40.5" cy="35" rx="5.5" ry="6.5" fill="#2B2B33" transform="rotate(25 40.5 35)" />
      <circle cx="18" cy="46" r="3" fill="#F8C9D5" /><circle cx="46" cy="46" r="3" fill="#F8C9D5" />
    </>,
    eyes: [[24, 35], [40, 35]], eye: 'panda', size: 1.7,
    front: <>
      <ellipse cx="32" cy="44" rx="3.5" ry="2.5" fill="#2B2B33" />
      <path d="M29 48 Q32 51 35 48" fill="none" stroke="#2B2B33" strokeWidth="1.6" strokeLinecap="round" />
    </>,
    blush: [[18, 46], [46, 46]],
  },
};

interface Props {
  friend?: FriendId;
  mood?: Mood;
  size?: number | string; // a number of pixels, or e.g. '100%' to fill a sized box
  label?: string;
}

export function Friend({ friend = 'owl', mood = 'idle', size = 56, label }: Props) {
  const art = ART[friend] ?? ART.owl;
  const name = label ?? FRIENDS.find(f => f.id === friend)?.name ?? '';

  const head = (
    <g transform="translate(4 6)">
      {art.base}
      <Eyes art={art} mood={mood} owl={friend === 'owl'} />
      {mood === 'encourage' && art.blush.map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.6" fill={BLUSH} />)}
      {art.front}
      {mood === 'happy' && art.smile && <path d={art.smile} fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />}
    </g>
  );

  return (
    <svg width={size} height={size} viewBox="0 0 72 72" role="img" aria-label={name} style={{ display: 'block', flexShrink: 0 }}>
      {mood === 'happy' && (
        <>
          <path d="M58 10 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1 Z" fill={palette.star.icon} />
          <path d="M8 6 l1.5 3.5 3.5 .5 -2.7 2.2 .8 3.6 -3.1 -2 -3.1 2 .8 -3.6 -2.7 -2.2 3.5 -.5 Z" fill={palette.star.icon} />
        </>
      )}
      {/* Only a correct answer gets a decoration (the stars); encouraging stays plain, so a wrong
          answer never looks rewarded. The owl also lifts its wings: both when happy, one when encouraging. */}
      {friend === 'owl' && mood === 'happy' && (
        <>
          <ellipse cx="12" cy="45" rx="6" ry="13" fill={OWL_WING} transform="rotate(30 12 45)" />
          <ellipse cx="60" cy="45" rx="6" ry="13" fill={OWL_WING} transform="rotate(-30 60 45)" />
        </>
      )}
      {friend === 'owl' && mood === 'encourage' && (
        <ellipse cx="61" cy="43" rx="5.5" ry="12" fill={OWL_WING} transform="rotate(-30 61 43)" />
      )}
      {mood === 'asks' ? <g transform="rotate(-8 36 44)">{head}</g> : head}
    </svg>
  );
}

function Eyes({ art, mood, owl }: { art: Art; mood: Mood; owl: boolean }) {
  return (
    <>
      {art.eyes.map(([x, y], index) => {
        // Owl eyes have white around the pupil; panda eyes sit in dark patches.
        const sclera = art.eye === 'owl' ? 9 : art.eye === 'panda' ? 3 : 0;
        if (mood === 'happy') {
          const half = art.eye === 'owl' ? 4 : art.eye === 'panda' ? 2.6 : art.size;
          return (
            <g key={index}>
              {art.eye === 'owl' && <circle cx={x} cy={y} r={sclera} fill="#FFFFFF" />}
              <path d={`M${x - half} ${y + 1} Q${x} ${y - half} ${x + half} ${y + 1}`} fill="none"
                stroke={art.eye === 'panda' ? '#FFFFFF' : INK} strokeWidth={art.eye === 'panda' ? 1.8 : 2.4} strokeLinecap="round" />
            </g>
          );
        }
        // Where the pupils look: inward when idle (owl), up when asking.
        const dx = mood === 'asks' ? (owl ? 2 : 0.8) : owl && mood === 'idle' ? (index === 0 ? 1 : -1) : 0;
        const dy = mood === 'asks' ? (owl ? -1 : -0.8) : owl ? 1 : 0;
        const px = x + dx, py = y + dy;
        const glint = art.eye === 'owl' ? 1.3 : Math.max(0.9, art.size * 0.32);
        return (
          <g key={index}>
            {sclera > 0 && <circle cx={x} cy={y} r={sclera} fill="#FFFFFF" />}
            {art.eye === 'oval'
              ? <ellipse cx={px} cy={py} rx={art.size} ry={art.size * 1.33} fill={INK} />
              : <circle cx={art.eye === 'panda' ? px + 0.6 : px} cy={art.eye === 'panda' ? py + 0.4 : py} r={art.size} fill={art.eye === 'panda' ? '#2B2B33' : INK} />}
            {art.eye !== 'panda' && <circle cx={px + glint * 1.1} cy={py - glint * 1.2} r={glint} fill="#FFFFFF" />}
          </g>
        );
      })}
    </>
  );
}
