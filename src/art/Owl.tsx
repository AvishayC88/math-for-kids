import { palette } from './palette';

export type Mood = 'idle' | 'asks' | 'happy' | 'encourage';

const BODY = '#8B6A4F';
const WING = '#7A5B42';
const BELLY = '#EAD7BF';
const BEAK = '#F59E0B';
const BLUSH = '#F4A9B8';

interface Props {
  mood?: Mood;
  size?: number | string; // a number of pixels, or e.g. '100%' to fill a sized box
  label?: string;
}

// The owl guide. idle: introduces a task. asks: head tilted, waiting for an answer.
// happy: correct answer. encourage: gentle "try again".
export function Owl({ mood = 'idle', size = 56, label = 'ינשוף' }: Props) {
  const ink = palette.ink;
  const pupils = mood === 'asks'
    ? [[30, 36], [46, 36]]
    : mood === 'encourage' ? [[28, 38], [44, 38]] : [[29, 38], [43, 38]];

  const face = (
    <>
      <path d="M18 30 L21 15 L31 24 Z" fill={BODY} />
      <path d="M54 30 L51 15 L41 24 Z" fill={BODY} />
      <ellipse cx="36" cy="44" rx="22" ry="22" fill={BODY} />
      <ellipse cx="36" cy="51" rx="13" ry="13" fill={BELLY} />
      <circle cx="28" cy="37" r="9" fill="#FFFFFF" />
      <circle cx="44" cy="37" r="9" fill="#FFFFFF" />
      {mood === 'happy' ? (
        <>
          <path d="M24 38 Q28 33 32 38" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M40 38 Q44 33 48 38" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
        </>
      ) : (
        pupils.map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="4" fill={ink} />
            <circle cx={x + 1.4} cy={y - 1.6} r="1.3" fill="#FFFFFF" />
          </g>
        ))
      )}
      {mood === 'encourage' && (
        <>
          <circle cx="21" cy="47" r="3.6" fill={BLUSH} />
          <circle cx="51" cy="47" r="3.6" fill={BLUSH} />
        </>
      )}
      <path d="M33 44 L39 44 L36 49 Z" fill={BEAK} />
    </>
  );

  return (
    <svg width={size} height={size} viewBox="0 0 72 72" role="img" aria-label={label} style={{ display: 'block', flexShrink: 0 }}>
      {mood === 'happy' && (
        <>
          <path d="M58 10 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1 Z" fill={palette.star.icon} />
          <path d="M8 6 l1.5 3.5 3.5 .5 -2.7 2.2 .8 3.6 -3.1 -2 -3.1 2 .8 -3.6 -2.7 -2.2 3.5 -.5 Z" fill={palette.star.icon} />
          <ellipse cx="12" cy="45" rx="6" ry="13" fill={WING} transform="rotate(30 12 45)" />
          <ellipse cx="60" cy="45" rx="6" ry="13" fill={WING} transform="rotate(-30 60 45)" />
        </>
      )}
      {mood === 'encourage' && (
        <>
          <path d="M5 15 c0-3.2 4.2-3.2 4.2 0 c0-3.2 4.2-3.2 4.2 0 c0 3.4-4.2 5.4-4.2 6.6 c0-1.2-4.2-3.2-4.2-6.6z" fill="#F08AA4" />
          <ellipse cx="61" cy="43" rx="5.5" ry="12" fill={WING} transform="rotate(-30 61 43)" />
        </>
      )}
      {mood === 'asks' ? <g transform="rotate(-8 36 44)">{face}</g> : face}
    </svg>
  );
}
