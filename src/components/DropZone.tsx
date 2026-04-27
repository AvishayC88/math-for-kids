import { useDroppable } from '@dnd-kit/core';
import { PlaceValue, MontessoriBlock as BlockType } from '../domain/types';
import { MontessoriBlock } from './MontessoriBlock';

interface Props {
  id: string;
  type: PlaceValue;
  title: string;
  blocks: BlockType[];
}

export function DropZone({ id, type, title, blocks }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    // The zone declares what type of blocks it accepts
    data: { accepts: type },
  });

  // Visual feedback when dragging over the zone
  const bgActive = isOver ? (type === 'ten' ? 'bg-blue-100' : 'bg-green-100') : 'bg-white';
  const borderColor = type === 'ten' ? 'border-blue-300' : 'border-green-300';

  return (
    <div 
      ref={setNodeRef}
      className={`flex-1 min-h-[400px] border-4 border-dashed ${borderColor} rounded-xl ${bgActive} transition-colors p-4 flex flex-col items-center`}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-400">{title}</h2>
      <div className="flex flex-wrap gap-2 justify-center content-start flex-1 w-full">
        {blocks.map((block) => (
          <MontessoriBlock key={block.id} id={block.id} type={block.type} />
        ))}
      </div>
    </div>
  );
}
