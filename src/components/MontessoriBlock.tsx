import { useDraggable } from '@dnd-kit/core';
import { PlaceValue } from '../domain/types';

interface Props {
  id: string;
  type: PlaceValue;
  isDraggable?: boolean;
  isOverlay?: boolean;
  // Callback for tapping to delete (only available for placed blocks)
  onRemove?: () => void;
}

export function MontessoriBlock({ id, type, isDraggable = false, isOverlay = false, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { type },
    disabled: !isDraggable,
  });

  // Prevent any bubbling if the user taps to delete
  const handleClick = (e: React.MouseEvent) => {
    if (onRemove) {
      e.stopPropagation();
      onRemove();
    }
  };

  const baseClasses = "rounded-sm shadow-md transition-all duration-200 flex items-center justify-center font-bold text-white relative overflow-hidden";
  
  let typeClasses = "";
  let innerContent = null;

  switch (type) {
    case 'unit':
      typeClasses = "bg-green-500 w-8 h-8 border border-green-600 text-xs";
      break;
    case 'ten':
      typeClasses = "bg-blue-500 w-8 h-32 border border-blue-600 text-xs";
      innerContent = [...Array(9)].map((_, i) => (
        <div key={i} className="w-full border-b border-blue-400 opacity-50 pointer-events-none" />
      ));
      break;
    case 'hundred':
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
      typeClasses = "bg-emerald-600 w-40 h-40 border-2 border-emerald-800 shadow-xl";
      innerContent = (
        <div className="text-emerald-800 opacity-20 text-4xl font-black pointer-events-none">1000</div>
      );
      break;
  }
  
  const opacity = isDragging && !isOverlay ? "opacity-0" : "opacity-100";
  
  // Dynamic visual feedback: hover effects for deletion vs grabbing
  const actionClasses = onRemove 
    ? "cursor-pointer hover:opacity-90 hover:scale-95 hover:ring-2 hover:ring-red-400 active:scale-90" 
    : (isOverlay ? "scale-110 shadow-2xl cursor-grabbing z-50" : (isDraggable ? "cursor-grab hover:scale-105" : ""));

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`${baseClasses} ${typeClasses} ${opacity} ${actionClasses}`}
    >
      {type === 'ten' ? (
        <div className="flex flex-col h-full w-full justify-between py-1 pointer-events-none">{innerContent}</div>
      ) : (
        innerContent
      )}
    </div>
  );
}
