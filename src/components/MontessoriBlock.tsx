import { useDraggable } from '@dnd-kit/core';
import { PlaceValue } from '../domain/types';

interface Props {
  id: string;
  type: PlaceValue;
  isDraggable?: boolean;
  isOverlay?: boolean;
  onRemove?: () => void;
}

export function MontessoriBlock({ id, type, isDraggable = false, isOverlay = false, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { type },
    disabled: !isDraggable,
  });

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (onRemove) {
      e.stopPropagation();
      onRemove();
    }
  };

  // Senior Engineer Tip: Use -webkit-user-drag and touch-action to fully 
  // relinquish control from the browser to our JS logic.
  const baseClasses = "rounded-sm shadow-md transition-all duration-200 flex items-center justify-center font-bold text-white relative overflow-hidden select-none touch-none";
  
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
  const actionClasses = onRemove 
    ? "cursor-pointer hover:opacity-90 hover:scale-95 active:scale-90" 
    : (isOverlay ? "scale-110 shadow-2xl cursor-grabbing z-50" : (isDraggable ? "cursor-grab" : ""));

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      // Critical for mobile: prevent native context menu
      onContextMenu={(e) => e.preventDefault()}
      className={`${baseClasses} ${typeClasses} ${opacity} ${actionClasses}`}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none'
      }}
    >
      {type === 'ten' ? (
        <div className="flex flex-col h-full w-full justify-between py-1 pointer-events-none">{innerContent}</div>
      ) : (
        innerContent
      )}
    </div>
  );
}
