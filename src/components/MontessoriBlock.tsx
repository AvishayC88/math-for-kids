import { useDraggable } from '@dnd-kit/core';
import { PlaceValue } from '../domain/types';

interface Props {
  id: string;
  type: PlaceValue;
  isDraggable?: boolean;
  // Overlay mode is used when the item is currently being dragged
  isOverlay?: boolean;
}

export function MontessoriBlock({ id, type, isDraggable = false, isOverlay = false }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { type },
    disabled: !isDraggable,
  });

  // Visual mapping for Montessori principles
  const baseClasses = "rounded-sm shadow-md transition-transform flex items-center justify-center font-bold text-white text-xs";
  const typeClasses = type === 'ten' 
    ? "bg-blue-500 w-8 h-32 border border-blue-600" 
    : "bg-green-500 w-8 h-8 border border-green-600";
  
  // Hide the original block while dragging to leave a "ghost" or empty space
  const opacity = isDragging && !isOverlay ? "opacity-0" : "opacity-100";
  const scale = isOverlay ? "scale-110 shadow-xl cursor-grabbing z-50" : (isDraggable ? "cursor-grab hover:scale-105" : "");

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${baseClasses} ${typeClasses} ${opacity} ${scale}`}
    >
      {type === 'ten' && (
        <div className="flex flex-col h-full w-full justify-between py-1">
          {/* Create 10 lines to simulate beads in a ten-bar */}
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-full border-b border-blue-400 opacity-50" />
          ))}
        </div>
      )}
    </div>
  );
}
