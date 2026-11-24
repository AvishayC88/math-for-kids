import type { CSSProperties } from 'react';
import type { PlaceValue } from '../domain/types';
import { palette } from './palette';

// Sizes at scale 1, from the approved mocks. A column that is filling up passes a smaller scale.
const UNIT = 18;
const TEN = { width: 16, height: 80 };
const HUNDRED = 72;
const THOUSAND = 72;

interface Props {
  type: PlaceValue;
  scale?: number;
  style?: CSSProperties;
}

// The look of one block. Dragging, removing and fading are up to the screen that shows it.
export function Block({ type, scale = 1, style }: Props) {
  const color = palette.place[type].block;

  if (type === 'thousand') return <ThousandCube size={THOUSAND * scale} style={style} />;

  if (type === 'ten') {
    const height = TEN.height * scale;
    const segment = height / 10;
    return (
      <div style={{
        width: TEN.width * scale,
        height,
        borderRadius: 3,
        backgroundColor: color,
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${segment - 1}px, rgba(23,37,84,.35) ${segment - 1}px ${segment}px)`,
        ...style,
      }} />
    );
  }

  if (type === 'hundred') {
    const line = 'rgba(127,29,29,.35) 1px, transparent 1px';
    return (
      <div style={{
        width: HUNDRED * scale,
        height: HUNDRED * scale,
        borderRadius: 6 * scale,
        backgroundColor: color,
        backgroundImage: `linear-gradient(to right, ${line}), linear-gradient(to bottom, ${line})`,
        backgroundSize: '10% 10%',
        ...style,
      }} />
    );
  }

  return (
    <div style={{
      width: UNIT * scale,
      height: UNIT * scale,
      borderRadius: 4 * scale,
      backgroundColor: color,
      boxShadow: 'inset 0 -2px 0 rgba(0,0,0,.12)',
      ...style,
    }} />
  );
}

// The thousand is a cube, like the classroom material: the same green family as the unit,
// told apart by shape, size and a darker shade.
function ThousandCube({ size, style }: { size: number; style?: CSSProperties }) {
  const grid = Array.from({ length: 9 }, (_, i) => 4.8 * (i + 1));
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden="true" style={{ display: 'block', ...style }}>
      <polygon points="0,12 12,0 60,0 48,12" fill="#10916A" />
      <polygon points="48,12 60,0 60,48 48,60" fill="#035C40" />
      <rect x="0" y="12" width="48" height="48" fill={palette.place.thousand.block} />
      <path
        d={grid.map(v => `M${v} 12V60M0 ${12 + v}H48`).join('')}
        stroke="rgba(0,0,0,.18)"
        strokeWidth=".6"
      />
    </svg>
  );
}
