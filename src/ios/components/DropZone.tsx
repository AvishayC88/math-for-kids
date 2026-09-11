import { useDroppable } from '@dnd-kit/core';
import { PlaceValue, MontessoriBlock as BlockType } from '../../domain/types';
import { MontessoriBlock } from './MontessoriBlock';

interface Props {
  id: string;
  type: PlaceValue;
  title: string;
  blocks: BlockType[];
  onRemoveBlock: (id: string) => void;
}

export function DropZone({ id, type, title, blocks, onRemoveBlock }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { accepts: type },
  });

  let borderColor = '';
  let bgHoverColor = '';
  
  switch(type) {
    case 'unit': borderColor = 'border-green-300'; bgHoverColor = 'bg-green-100'; break;
    case 'ten': borderColor = 'border-blue-300'; bgHoverColor = 'bg-blue-100'; break;
    case 'hundred': borderColor = 'border-red-300'; bgHoverColor = 'bg-red-100'; break;
    case 'thousand': borderColor = 'border-emerald-300'; bgHoverColor = 'bg-emerald-100'; break;
  }

  const activeBg = isOver ? bgHoverColor : 'bg-white';

  return (
    <div 
      ref={setNodeRef}
      className={`drop-zone flex-1 min-w-0 border-2 sm:border-4 border-dashed ${borderColor} rounded-xl ${activeBg} transition-colors p-1 sm:p-4 flex flex-col items-center`}
    >
      <h2 className="shrink-0 text-xs sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-400 text-center truncate w-full">{title}</h2>
      <div className="drop-zone-blocks flex flex-wrap gap-1 sm:gap-2 justify-center content-start w-full pb-2">
        {blocks.map((block) => (
          <MontessoriBlock 
            key={block.id} 
            id={block.id} 
            type={block.type} 
            onRemove={() => onRemoveBlock(block.id)} 
          />
        ))}
      </div>
    </div>
  );
}

