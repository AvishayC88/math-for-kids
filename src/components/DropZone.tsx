import { useDroppable } from '@dnd-kit/core';
import { PlaceValue, MontessoriBlock as BlockType } from '../domain/types';
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

  // Dynamic border and background colors based on place value
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
      className={`flex-1 min-h-[400px] border-4 border-dashed ${borderColor} rounded-xl ${activeBg} transition-colors p-4 flex flex-col items-center`}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-400">{title}</h2>
      <div className="flex flex-wrap gap-2 justify-center content-start flex-1 w-full">
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
