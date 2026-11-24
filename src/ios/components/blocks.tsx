import { useDraggable } from '@dnd-kit/core';
import type { PlaceValue } from '../../domain/types';
import { PLACE_NAMES } from '../../domain/places';
import { Block } from '../../art/Block';

// Shelf blocks are drawn smaller than blocks in the tray, so the tray keeps the room.
const SHELF_SCALE: Record<PlaceValue, number> = { unit: 1, ten: 0.7, hundred: 0.61, thousand: 0.67 };

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

// A block in the tray: tap it to put it back. The padding widens the tap area without moving the layout.
export function PlacedBlock({ type, scale, onRemove }: { type: PlaceValue; scale: number; onRemove: () => void }) {
  return (
    <button type="button" onClick={onRemove} aria-label="החזרת הקובייה למדף"
      className="-m-1 p-1 rounded-lg transition-transform active:scale-90">
      <Block type={type} scale={scale} />
    </button>
  );
}
