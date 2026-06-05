import { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';
import { useGameStore } from '../store/useGameStore';
import { PlaceValue } from '../domain/types';
import { DropZone } from './DropZone';
import { MontessoriBlock } from './MontessoriBlock';

export function GameScreen() {
  const store = useGameStore();
  const [activeDragType, setActiveDragType] = useState<PlaceValue | null>(null);

  // Zero-latency sensors
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const unitsBlocks = store.placedBlocks.filter(b => b.type === 'unit');
  const tensBlocks = store.placedBlocks.filter(b => b.type === 'ten');
  const hundredsBlocks = store.placedBlocks.filter(b => b.type === 'hundred');
  const thousandsBlocks = store.placedBlocks.filter(b => b.type === 'thousand');

  const showHundreds = store.currentTargetNumber >= 100;
  const showThousands = store.currentTargetNumber >= 1000;

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragType(active.data.current?.type);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragType(null);

    if (!over) return;

    const droppedType = active.data.current?.type as PlaceValue;
    const targetAccepts = over.data.current?.accepts as PlaceValue;

    if (droppedType === targetAccepts) {
      store.addBlock(droppedType);
    }
  };

  return (
    // ARCHITECT NOTE: Kept the robust h-full w-full layout.
    <div className="h-full w-full pt-2 sm:pt-4 flex flex-col font-sans select-none overflow-hidden bg-white" dir="rtl">
      
      <div className="flex-1 min-h-0 flex flex-col max-w-6xl mx-auto w-full h-full">
        
        {/* Header - Fixed */}
        <div className="text-center pb-2 sm:pb-6 shrink-0 px-2">
          <h1 className="text-2xl sm:text-5xl font-extrabold text-gray-800 mb-2">
            בנו את המספר: <span className="text-purple-600">{store.currentTargetNumber}</span>
          </h1>
          
          {store.interactionState === 'error' && store.feedbackMessage && (
            <div className="mt-1 p-2 sm:p-4 max-w-lg mx-auto bg-orange-100 text-orange-800 rounded-xl border border-orange-200 shadow-sm animate-bounce">
              <span className="font-bold text-sm sm:text-xl">{store.feedbackMessage}</span>
            </div>
          )}

          {/* ARCHITECT NOTE: Replaced hardcoded "10 coins" string with dynamic store.feedbackMessage */}
          {store.interactionState === 'success' && store.feedbackMessage && (
            <div className="mt-1 p-2 sm:p-4 max-w-lg mx-auto bg-green-100 text-green-800 rounded-xl shadow-sm text-sm sm:text-2xl font-bold">
              {store.feedbackMessage}
            </div>
          )}
        </div>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          
          {/* DropZones Area - Flexible, takes remaining space but can shrink */}
          <div className="flex flex-row gap-1 sm:gap-4 flex-1 min-h-0 px-1 sm:px-4 w-full flex-nowrap items-stretch overflow-hidden pb-2">
            <DropZone id="zone-unit" type="unit" title="אחדות" blocks={unitsBlocks} onRemoveBlock={store.removeBlock} />
            <DropZone id="zone-ten" type="ten" title="עשרות" blocks={tensBlocks} onRemoveBlock={store.removeBlock} />
            {showHundreds && <DropZone id="zone-hundred" type="hundred" title="מאות" blocks={hundredsBlocks} onRemoveBlock={store.removeBlock} />}
            {showThousands && <DropZone id="zone-thousand" type="thousand" title="אלפים" blocks={thousandsBlocks} onRemoveBlock={store.removeBlock} />}
          </div>

          {/* Toolbox - Fixed at bottom of DndContext */}
          <div className="w-full bg-gray-100 p-3 sm:p-6 rounded-t-3xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t-4 border-gray-200 shrink-0 flex flex-row justify-around items-end relative z-10 flex-nowrap">
            {showThousands && (
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <MontessoriBlock id="src-thousand" type="thousand" isDraggable />
                <span className="text-[10px] sm:text-lg font-bold text-gray-500">אלפים</span>
              </div>
            )}
            {showHundreds && (
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <MontessoriBlock id="src-hundred" type="hundred" isDraggable />
                <span className="text-[10px] sm:text-lg font-bold text-gray-500">מאות</span>
              </div>
            )}
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <MontessoriBlock id="src-ten" type="ten" isDraggable />
              <span className="text-[10px] sm:text-lg font-bold text-gray-500">עשרות</span>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <MontessoriBlock id="src-unit" type="unit" isDraggable />
              <span className="text-[10px] sm:text-lg font-bold text-gray-500">אחדות</span>
            </div>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeDragType ? <MontessoriBlock id="overlay" type={activeDragType} isOverlay /> : null}
          </DragOverlay>
        </DndContext>

        {/* Action Button - Strictly Fixed at the very bottom */}
        <div className="bg-gray-100 pb-6 pt-2 sm:pt-4 shrink-0 flex justify-center w-full relative z-20">
          <button 
            onClick={store.checkAnswer}
            // ARCHITECT NOTE: Re-applied the Double Submission fix!
            disabled={store.placedBlocks.length === 0 || store.interactionState === 'success'}
            className="w-11/12 sm:w-auto py-3 sm:py-4 px-8 sm:px-16 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold text-xl sm:text-3xl rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            בדוק אותי!
          </button>
        </div>
      </div>
    </div>
  );
}