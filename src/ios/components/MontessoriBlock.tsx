import { useDraggable } from '@dnd-kit/core';
import { MontessoriBlock as IBlock } from '../../domain/types';

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

  const baseStyles = `relative flex-shrink-0 transition-all select-none ${isDraggable ? 'dnd-strict-lock min-w-11' : ''}`;
  const interactStyles = onClick ? "cursor-pointer active:scale-90 hover:brightness-110" : (isDraggable ? "cursor-grab active:scale-105" : "");
  
  const ghostStyles = isGhosted ? "opacity-25 border-dashed border-2 border-gray-400 scale-90 grayscale" : "";

  const getOverlayMarker = () => {
    if (!onRemove) return null;
    return (
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        aria-label="הסרת קובייה"
        className="absolute inset-0 w-full h-full text-white rounded flex items-start justify-end font-bold text-sm z-10"
      >
        <span className="bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">✕</span>
      </button>
    );
  };

  if (type === 'ten') {
    return (
      <div ref={setNodeRef} {...listeners} {...attributes} onClick={onClick}
        className={`${baseStyles} ${interactStyles} bg-blue-600 rounded shadow ${ghostStyles} w-11 h-24 sm:h-36 ${isDragging && 'opacity-0'}`}
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
        className={`${baseStyles} ${interactStyles} bg-red-500 rounded-lg shadow-md ${ghostStyles} w-14 h-14 sm:w-28 sm:h-28 ${isDragging && 'opacity-0'}`}
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
    const thousandSizeClass = "w-14 h-14 sm:w-32 sm:h-32";
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
      className={`relative flex items-center justify-center transition-all select-none ${isDraggable ? 'dnd-strict-lock' : ''} ${
        isToolboxUnit 
          ? 'w-12 h-12 sm:w-16 sm:h-16 cursor-grab active:scale-105' 
          : `${onRemove || onClick ? 'w-11 h-11' : unitVisualSizeClass} ${onClick ? 'cursor-pointer active:scale-90 hover:brightness-110' : ''}`
      } ${isDragging ? 'opacity-0' : ''}`}
    >
      {/* The actual visible green block */}
      <div className={`${unitVisualSizeClass} bg-green-500 rounded-sm shadow-sm ${ghostStyles}`} />
      
      {/* The 'X' marker automatically positions itself correctly because on the board, the wrapper shrinks */}
      {getOverlayMarker()}
    </div>
  );
}

