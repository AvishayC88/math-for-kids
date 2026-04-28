import { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor
} from '@dnd-kit/core';
import { useGameStore } from '../store/useGameStore';
import { PlaceValue } from '../domain/types';
import { DropZone } from './DropZone';
import { MontessoriBlock } from './MontessoriBlock';

export function GameScreen() {
  const store = useGameStore();
  const [activeDragType, setActiveDragType] = useState<PlaceValue | null>(null);

  /**
   * ARCHITECT NOTE: Sensors configuration for Cross-Platform support.
   * We use PointerSensor for mouse and TouchSensor for mobile devices.
   * The 'activationConstraint' is critical to distinguish between a tap (for deletion)
   * and a drag, while 'tolerance' is increased to 15 for iOS precision.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requires 8px movement to start dragging on desktop
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,   // Requires 150ms hold to start dragging on mobile
        tolerance: 15, // Higher tolerance for iOS touch jitter
      },
    })
  );

  // Derived state: Filter blocks for each place value column
  const unitsBlocks = store.placedBlocks.filter(b => b.type === 'unit');
  const tensBlocks = store.placedBlocks.filter(b => b.type === 'ten');
  const hundredsBlocks = store.placedBlocks.filter(b => b.type === 'hundred');
  const thousandsBlocks = store.placedBlocks.filter(b => b.type === 'thousand');

  // Adaptive layout logic: Only show columns relevant to the current level
  const showHundreds = store.currentTargetNumber >= 100;
  const showThousands = store.currentTargetNumber >= 1000;

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragType(active.data.current?.type);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragType(null);

    // If not dropped over a valid drop zone, ignore
    if (!over) return;

    const droppedType = active.data.current?.type as PlaceValue;
    const targetAccepts = over.data.current?.accepts as PlaceValue;

    // Strict Montessori rule: Blocks must match their designated column
    if (droppedType === targetAccepts) {
      store.addBlock(droppedType);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-8 flex flex-col h-screen font-sans select-none" dir="rtl">
      {/* Header Section: Target Number & Feedback */}
      <div className="text-center pb-6">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          בני את המספר: <span className="text-purple-600">{store.currentTargetNumber}</span>
        </h1>
        
        {/* Dynamic Feedback Message (Errors and Montessori Rules) */}
        {store.interactionState === 'error' && store.feedbackMessage && (
          <div className="mt-4 p-4 max-w-lg mx-auto bg-orange-100 text-orange-800 rounded-xl border border-orange-200 shadow-sm animate-bounce">
            <span className="font-bold text-xl">
              {store.feedbackMessage}
            </span>
          </div>
        )}

        {/* Success Feedback Component */}
        {store.interactionState === 'success' && (
          <div className="mt-4 p-4 max-w-lg mx-auto bg-green-100 text-green-800 rounded-xl shadow-sm text-2xl font-bold">
            אלופה! אספת עוד 10 מטבעות! (סה"כ: {store.coinsCollected})
          </div>
        )}
      </div>

      {/* Main Interaction Area using dnd-kit */}
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        {/* Adaptive Grid Layout: Columns respond to number range */}
        <div className="flex gap-4 flex-1 px-4 overflow-x-auto min-h-[450px]">
          <DropZone 
            id="zone-unit" 
            type="unit" 
            title="אחדות (ירוק)" 
            blocks={unitsBlocks} 
            onRemoveBlock={store.removeBlock} 
          />
          <DropZone 
            id="zone-ten" 
            type="ten" 
            title="עשרות (כחול)" 
            blocks={tensBlocks} 
            onRemoveBlock={store.removeBlock} 
          />
          
          {showHundreds && (
            <DropZone 
              id="zone-hundred" 
              type="hundred" 
              title="מאות (אדום)" 
              blocks={hundredsBlocks} 
              onRemoveBlock={store.removeBlock} 
            />
          )}
          
          {showThousands && (
            <DropZone 
              id="zone-thousand" 
              type="thousand" 
              title="אלפים (ירוק)" 
              blocks={thousandsBlocks} 
              onRemoveBlock={store.removeBlock} 
            />
          )}
        </div>

        {/* The Toolbox: Source of new blocks */}
        <div className="w-full bg-gray-100 p-6 rounded-t-3xl shadow-inner border-t-4 border-gray-200 mt-8 flex justify-center gap-8 sm:gap-24 items-end overflow-x-auto">
          {showThousands && (
            <div className="flex flex-col items-center gap-3">
              <MontessoriBlock id="src-thousand" type="thousand" isDraggable />
              <span className="text-lg font-bold text-gray-500">אלפים</span>
            </div>
          )}
          {showHundreds && (
            <div className="flex flex-col items-center gap-3">
              <MontessoriBlock id="src-hundred" type="hundred" isDraggable />
              <span className="text-lg font-bold text-gray-500">מאות</span>
            </div>
          )}
          <div className="flex flex-col items-center gap-3">
            <MontessoriBlock id="src-ten" type="ten" isDraggable />
            <span className="text-lg font-bold text-gray-500">עשרות</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <MontessoriBlock id="src-unit" type="unit" isDraggable />
            <span className="text-lg font-bold text-gray-500">אחדות</span>
          </div>
        </div>

        {/* DragOverlay for smooth UI movement during dragging */}
        <DragOverlay dropAnimation={null}>
          {activeDragType ? (
            <MontessoriBlock id="overlay" type={activeDragType} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Primary Action Button */}
      <div className="bg-gray-100 pb-8 pt-4 flex justify-center">
        <button 
          onClick={store.checkAnswer}
          disabled={store.placedBlocks.length === 0}
          className="py-4 px-16 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold text-3xl rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          בדוק אותי!
        </button>
      </div>
    </div>
  );
}
