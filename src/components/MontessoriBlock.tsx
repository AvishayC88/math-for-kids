import { useDraggable } from '@dnd-kit/core';
import { PlaceValue } from '../domain/types';

interface Props {
  id: string;
  type: PlaceValue;
  isDraggable?: boolean;
  isOverlay?: boolean;
}

export function MontessoriBlock({ id, type, isDraggable = false, isOverlay = false }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { type },
    disabled: !isDraggable,
  });

  const baseClasses = "rounded-sm shadow-md transition-transform flex items-center justify-center font-bold text-white relative overflow-hidden";
  
  // Adaptive sizing and coloring based on place value
  let typeClasses = "";
  let innerContent = null;

  switch (type) {
    case 'unit':
      typeClasses = "bg-green-500 w-8 h-8 border border-green-600 text-xs";
      break;
    case 'ten':
      typeClasses = "bg-blue-500 w-8 h-32 border border-blue-600 text-xs";
      innerContent = [...Array(9)].map((_, i) => (
        <div key={i} className="w-full border-b border-blue-400 opacity-50" />
      ));
      break;
    case 'hundred':
      // 100-square: Red flat square with a grid pattern
      typeClasses = "bg-red-500 w-32 h-32 border border-red-600";
      innerContent = (
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-30 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-red-800" />
          ))}
        </div>
      );
      break;
    case 'thousand':
      // 1000-cube: Large distinct green square to simulate the physical cube
      typeClasses = "bg-emerald-600 w-40 h-40 border-2 border-emerald-800 shadow-xl";
      innerContent = (
        <div className="text-emerald-800 opacity-20 text-4xl font-black">1000</div>
      );
      break;
  }
  
  const opacity = isDragging && !isOverlay ? "opacity-0" : "opacity-100";
  const scale = isOverlay ? "scale-110 shadow-2xl cursor-grabbing z-50" : (isDraggable ? "cursor-grab hover:scale-105" : "");

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${baseClasses} ${typeClasses} ${opacity} ${scale}`}
    >
      {type === 'ten' ? (
        <div className="flex flex-col h-full w-full justify-between py-1">{innerContent}</div>
      ) : (
        innerContent
      )}
    </div>
  );
}
