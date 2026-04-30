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
  // ZERO latency drag. No distance, no delay constraints.
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { type },
    disabled: !isDraggable,
  });

  const handleRemoveClick = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  const baseClasses = "group rounded-sm shadow-md transition-all duration-200 flex items-center justify-center font-bold text-white relative overflow-hidden select-none shrink-0";
  
  let typeClasses = "";
  let innerContent = null;
  let removeBtnColor = "";
  const isPlacedBlock = Boolean(onRemove) && !isOverlay;

  switch (type) {
    case 'unit':
      // Responsive sizes: smaller on mobile, normal on sm+ screens
      typeClasses = "bg-green-500 w-6 h-6 sm:w-8 sm:h-8 border border-green-600 text-[10px] sm:text-xs";
      removeBtnColor = "bg-green-700 text-white";
      break;
    case 'ten':
      typeClasses = "bg-blue-500 w-6 h-24 sm:w-8 sm:h-32 border border-blue-600 text-xs";
      removeBtnColor = "bg-blue-700 text-white";
      innerContent = [...Array(9)].map((_, i) => (
        <div key={i} className="w-full border-b border-blue-400 opacity-50 pointer-events-none" />
      ));
      break;
    case 'hundred':
      typeClasses = "bg-red-500 w-20 h-20 sm:w-32 sm:h-32 border border-red-600";
      removeBtnColor = "bg-red-700 text-white";
      innerContent = (
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-30 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-red-800" />
          ))}
        </div>
      );
      break;
    case 'thousand':
      typeClasses = isPlacedBlock
        ? "bg-emerald-600 w-full max-w-24 aspect-square sm:max-w-40 border-2 border-emerald-800 shadow-xl"
        : "bg-emerald-600 w-24 h-24 sm:w-40 sm:h-40 border-2 border-emerald-800 shadow-xl";
      removeBtnColor = "bg-emerald-800 text-white";
      innerContent = (
        <div className="text-emerald-800 opacity-20 text-xs sm:text-4xl font-black pointer-events-none">1000</div>
      );
      break;
  }
  
  const opacity = isDragging && !isOverlay ? "opacity-0" : "opacity-100";
  const actionClasses = isOverlay
    ? "scale-110 shadow-2xl cursor-grabbing z-50 touch-none"
    : (isDraggable ? "cursor-grab touch-none" : "");

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onContextMenu={(e) => e.preventDefault()}
      data-draggable-block={isDraggable || isOverlay ? 'true' : undefined}
      className={`${baseClasses} ${typeClasses} ${opacity} ${actionClasses}`}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        touchAction: isDraggable || isOverlay ? 'none' : 'manipulation'
      }}
    >
      {onRemove && !isOverlay && (
        <button
          onPointerDown={handleRemoveClick}
          className={`absolute top-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs z-10 transition-opacity duration-200 ${removeBtnColor} opacity-100 [@media(hover:hover)]:opacity-0 group-hover:opacity-100`}
          aria-label="Remove block"
        >
          ✕
        </button>
      )}

      {type === 'ten' ? (
        <div className="flex flex-col h-full w-full justify-between py-1 pointer-events-none">{innerContent}</div>
      ) : (
        innerContent
      )}
    </div>
  );
}
