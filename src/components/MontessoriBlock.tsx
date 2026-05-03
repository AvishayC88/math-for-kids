import { useDraggable } from '@dnd-kit/core';
import { MontessoriBlock as IBlock } from '../domain/types';

interface Props {
  id: string;
  type: IBlock['type'];
  isDraggable?: boolean;
  isOverlay?: boolean;
  onRemove?: () => void;
  isGhosted?: boolean;
  onClick?: () => void; // NEW: Toggle handler
}

export function MontessoriBlock({ 
  id, type, isDraggable = false, isOverlay = false, onRemove, isGhosted = false, onClick
}: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { type },
    disabled: !isDraggable
  });

  const baseStyles = "relative flex-shrink-0 transition-all select-none";
  const interactStyles = onClick ? "cursor-pointer active:scale-90 hover:brightness-110" : (isDraggable ? "cursor-grab active:scale-105" : "");
  
  // Ghost styling
  const ghostStyles = isGhosted ? "opacity-25 border-dashed border-2 border-gray-400 scale-90 grayscale" : "";

  const typeStyles: Record<IBlock['type'], string> = {
    unit: `bg-green-500 rounded-sm shadow-sm`,
    ten: `bg-blue-600 rounded shadow`,
    hundred: `bg-red-500 rounded-lg shadow-md`,
    thousand: `bg-emerald-700 rounded-xl shadow-lg`,
  };

  const getOverlayMarker = () => {
    if (!onRemove) return null;
    return (
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md z-10"
      >
        ✕
      </button>
    );
  };

  if (type === 'ten') {
    return (
      <div ref={setNodeRef} {...listeners} {...attributes} onClick={onClick}
        className={`${baseStyles} ${interactStyles} ${typeStyles.ten} ${ghostStyles} w-7 sm:w-10 h-32 sm:h-44 ${isDragging && 'opacity-0'}`}
      >
        {getOverlayMarker()}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-full h-[10%] border-b border-blue-700/50 last:border-b-0" />
        ))}
      </div>
    );
  }

  if (type === 'hundred') {
    return (
      <div ref={setNodeRef} {...listeners} {...attributes} onClick={onClick}
        className={`${baseStyles} ${interactStyles} ${typeStyles.hundred} ${ghostStyles} w-24 h-24 sm:w-36 sm:h-36 ${isDragging && 'opacity-0'}`}
      >
        {getOverlayMarker()}
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="absolute w-[10%] h-[10%] border border-red-700/50"
               style={{ left: `${(i % 10) * 10}%`, top: `${Math.floor(i / 10) * 10}%` }} />
        ))}
      </div>
    );
  }

  const sizeClass = type === 'unit' ? "w-5 h-5 sm:w-7 sm:h-7" : "w-28 h-28 sm:w-40 sm:h-40";

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} onClick={onClick}
      className={`${baseStyles} ${interactStyles} ${typeStyles[type]} ${ghostStyles} ${sizeClass} ${isDragging && 'opacity-0'}`}
    >
      {getOverlayMarker()}
    </div>
  );
}