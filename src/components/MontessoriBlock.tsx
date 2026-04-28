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
  // ARCHITECT NOTE: Zero constraints on sensors means drag starts immediately.
  // This solves the mobile touchcancel bug completely.
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { type },
    disabled: !isDraggable,
  });

  // Dedicated remove handler for the 'X' button.
  // Crucial: We stop propagation on PointerDown so dnd-kit doesn't capture the event and start a drag.
  const handleRemoveClick = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  // Base classes include 'group' to allow child elements (the X button) to react to hover on the parent.
  const baseClasses = "group rounded-sm shadow-md transition-all duration-200 flex items-center justify-center font-bold text-white relative overflow-hidden select-none touch-none";
  
  let typeClasses = "";
  let innerContent = null;
  let removeBtnColor = "";

  switch (type) {
    case 'unit':
      typeClasses = "bg-green-500 w-8 h-8 border border-green-600 text-xs";
      removeBtnColor = "bg-green-700 text-white";
      break;
    case 'ten':
      typeClasses = "bg-blue-500 w-8 h-32 border border-blue-600 text-xs";
      removeBtnColor = "bg-blue-700 text-white";
      innerContent = [...Array(9)].map((_, i) => (
        <div key={i} className="w-full border-b border-blue-400 opacity-50 pointer-events-none" />
      ));
      break;
    case 'hundred':
      typeClasses = "bg-red-500 w-32 h-32 border border-red-600";
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
      typeClasses = "bg-emerald-600 w-40 h-40 border-2 border-emerald-800 shadow-xl";
      removeBtnColor = "bg-emerald-800 text-white";
      innerContent = (
        <div className="text-emerald-800 opacity-20 text-4xl font-black pointer-events-none">1000</div>
      );
      break;
  }
  
  const opacity = isDragging && !isOverlay ? "opacity-0" : "opacity-100";
  const actionClasses = isOverlay ? "scale-110 shadow-2xl cursor-grabbing z-50" : (isDraggable ? "cursor-grab" : "");

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onContextMenu={(e) => e.preventDefault()}
      className={`${baseClasses} ${typeClasses} ${opacity} ${actionClasses}`}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none'
      }}
    >
      {/* The Delete Badge ('X'). 
        - Default: opacity-100 (visible on mobile).
        - [@media(hover:hover)]:opacity-0 : Invisible on devices with real mouse.
        - group-hover:opacity-100 : Becomes visible when hovering the parent block on desktop.
      */}
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
