import { useDraggable } from '@dnd-kit/core';
import type { PlaceValue } from '../domain/types';
import { PLACE_NAMES } from '../domain/places';
import { Block } from '../art/Block';

// On a computer screen blocks are drawn a little bigger than in the iPhone app.
export const WEB_SCALE = 1.2;
const SHELF_SCALE: Record<PlaceValue, number> = { unit: 1.2, ten: 0.9, hundred: 0.83, thousand: 0.89 };

// A block on the shelf: drag it into its column.
export function SourceBlock({ type }: { type: PlaceValue }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `src-${type}`, data: { type } });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} aria-label={`גררו ${PLACE_NAMES[type]} למגש`}
      className={`dnd-strict-lock min-w-11 min-h-11 flex items-center justify-center cursor-grab ${isDragging ? 'opacity-40' : ''}`}>
      <Block type={type} scale={SHELF_SCALE[type]} />
    </div>
  );
}

// A block in the tray: click or tap it to put it back. The padding widens the target without moving the layout.
export function PlacedBlock({ type, scale, onRemove }: { type: PlaceValue; scale: number; onRemove: () => void }) {
  return (
    <button type="button" onClick={onRemove} aria-label="החזרת הקובייה למדף"
      className="-m-1 p-1 rounded-lg transition-transform hover:brightness-110 active:scale-90">
      <Block type={type} scale={scale} />
    </button>
  );
}
