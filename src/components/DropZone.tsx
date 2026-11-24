import { useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { MontessoriBlock as BlockData, PlaceValue } from '../domain/types';
import { PLACE_NAMES } from '../domain/places';
import { fitScale } from '../art/Block';
import { useElementSize } from '../art/useElementSize';
import { PlacedBlock, WEB_SCALE } from './blocks';

const TINT: Record<PlaceValue, string> = {
  unit: 'bg-place-unit-tint text-place-unit-text',
  ten: 'bg-place-ten-tint text-place-ten-text',
  hundred: 'bg-place-hundred-tint text-place-hundred-text',
  thousand: 'bg-place-thousand-tint text-place-thousand-text',
};
const GAP = 8;

// One compartment of the tray. Blocks get smaller as it fills (on a narrow screen sooner);
// past the smallest size it scrolls.
export function DropZone({ type, blocks, onRemove }: { type: PlaceValue; blocks: BlockData[]; onRemove: (id: string) => void }) {
  const { isOver, setNodeRef } = useDroppable({ id: `zone-${type}`, data: { accepts: type } });
  const area = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(area);
  // Each placed block has a 4px tap margin around it (see PlacedBlock); keep room for it at the edges.
  const scale = fitScale(type, blocks.length, width - 8, height - 8, GAP, 0.4, WEB_SCALE);

  return (
    <div ref={setNodeRef}
      className={`min-w-0 min-h-0 rounded-[20px] shadow-sunk pt-3.5 pb-2.5 px-1.5 flex flex-col items-center gap-3.5 ${TINT[type]} ${isOver ? 'ring-2 ring-inset ring-accent' : ''}`}>
      <p className="text-sm sm:text-base font-bold">{PLACE_NAMES[type]}</p>
      <div ref={area} className="flex-1 min-h-0 w-full overflow-y-auto overscroll-contain flex flex-wrap justify-center content-start gap-2">
        {blocks.map(block => (
          <PlacedBlock key={block.id} type={block.type} scale={scale} onRemove={() => onRemove(block.id)} />
        ))}
      </div>
    </div>
  );
}
