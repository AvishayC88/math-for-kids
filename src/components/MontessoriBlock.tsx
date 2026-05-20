import { useDraggable } from '@dnd-kit/core';
import { MontessoriBlock as IBlock } from '../domain/types';

interface Props {
  id: string;
  type: IBlock['type'];
  isDraggable?: boolean;
  isOverlay?: boolean;
  onRemove?: () => void;
  isGhosted?: boolean;
  onClick?: () => void;
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
  
  const ghostStyles = isGhosted ? "opacity-25 border-dashed border-2 border-gray-400 scale-90 grayscale" : "";

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
        className={`${baseStyles} ${interactStyles} bg-blue-600 rounded shadow ${ghostStyles} w-7 sm:w-10 h-32 sm:h-44 ${isDragging && 'opacity-0'}`}
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
        className={`${baseStyles} ${interactStyles} bg-red-500 rounded-lg shadow-md ${ghostStyles} w-24 h-24 sm:w-36 sm:h-36 ${isDragging && 'opacity-0'}`}
      >
        {getOverlayMarker()}
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="absolute w-[10%] h-[10%] border border-red-700/50"
               style={{ left: `${(i % 10) * 10}%`, top: `${Math.floor(i / 10) * 10}%` }} />
        ))}
      </div>
    );
  }

  if (type === 'thousand') {
    const thousandSizeClass = "w-28 h-28 sm:w-40 sm:h-40";
    return (
      <div ref={setNodeRef} {...listeners} {...attributes} onClick={onClick}
        className={`${baseStyles} ${interactStyles} bg-emerald-700 rounded-xl shadow-lg ${ghostStyles} ${thousandSizeClass} ${isDragging && 'opacity-0'}`}
      >
        {getOverlayMarker()}
      </div>
    );
  }

  // ARCHITECT FIX: Decoupled Hitbox for Units
  const unitVisualSizeClass = "w-5 h-5 sm:w-7 sm:h-7";
  const isToolboxUnit = isDraggable; // If it's draggable, it's sitting in the bottom toolbox

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes} 
      onClick={onClick}
      // The wrapper defines the touch target (Hitbox)
      // If it's in the toolbox, we give it a massive 48x48px (w-12 h-12) invisible interaction area.
      // If it's on the board, the wrapper snaps tightly to the visual size to prevent overlapping buttons.
      className={`relative flex items-center justify-center transition-all select-none touch-none ${
        isToolboxUnit 
          ? 'w-12 h-12 sm:w-16 sm:h-16 cursor-grab active:scale-105' 
          : `${unitVisualSizeClass} ${onClick ? 'cursor-pointer active:scale-90 hover:brightness-110' : ''}`
      } ${isDragging ? 'opacity-0' : ''}`}
    >
      {/* The actual visible green block */}
      <div className={`${unitVisualSizeClass} bg-green-500 rounded-sm shadow-sm ${ghostStyles}`} />
      
      {/* The 'X' marker automatically positions itself correctly because on the board, the wrapper shrinks */}
      {getOverlayMarker()}
    </div>
  );
}
