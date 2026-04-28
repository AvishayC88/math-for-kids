import { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import { useGameStore } from '../store/useGameStore';
import { PlaceValue } from '../domain/types';
import { DropZone } from './DropZone';
import { MontessoriBlock } from './MontessoriBlock';

export function GameScreen() {
  const store = useGameStore();
  const [activeDragType, setActiveDragType] = useState<PlaceValue | null>(null);

  /**
   * ARCHITECT NOTE: Unified Pointer Strategy.
   * By using ONLY PointerSensor with a small distance constraint, we bypass 
   * many mobile browser conflicts while still allowing Taps to work.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // A tiny move is enough to start drag, making it feel responsive.
      },
    })
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
    <div className="max-w-6xl mx-auto pt-8 flex flex-col h-screen font-sans select-none overflow-hidden" dir="rtl">
      <div className="text-center pb-6">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          בני את המספר: <span className="text-purple-600">{store.currentTargetNumber}</span>
        </h1>
        
        {store.interactionState === 'error' && store.feedbackMessage && (
          <div className="mt-4 p-4 max-w-lg mx-auto bg-orange-100 text-orange-800 rounded-xl border border-orange-200 shadow-sm animate-bounce">
            <span className="font-bold text-xl">{store.feedbackMessage}</span>
          </div>
        )}

        {store.interactionState === 'success' && (
          <div className="mt-4 p-4 max-w-lg mx-auto bg-green-100 text-green-800 rounded-xl shadow-sm text-2xl font-bold">
            אלופה! אספת עוד 10 מטבעות! (סה"כ: {store.coinsCollected})
          </div>
        )}
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-2 sm:gap-4 flex-1 px-2 sm:px-4 overflow-x-auto min-h-[450px]">
          <DropZone id="zone-unit" type="unit" title="אחדות" blocks={unitsBlocks} onRemoveBlock={store.removeBlock} />
          <DropZone id="zone-ten" type="ten" title="עשרות" blocks={tensBlocks} onRemoveBlock={store.removeBlock} />
          {showHundreds && <DropZone id="zone-hundred" type="hundred" title="מאות" blocks={hundredsBlocks} onRemoveBlock={store.removeBlock} />}
          {showThousands && <DropZone id="zone-thousand" type="thousand" title="אלפים" blocks={thousandsBlocks} onRemoveBlock={store.removeBlock} />}
        </div>

        <div className="w-full bg-gray-100 p-6 rounded-t-3xl shadow-inner border-t-4 border-gray-200 mt-8 flex justify-center gap-4 sm:gap-24 items-end overflow-x-auto">
          {showThousands && (
            <div className="flex flex-col items-center gap-3">
              <MontessoriBlock id="src-thousand" type="thousand" isDraggable />
              <span className="text-sm sm:text-lg font-bold text-gray-500">אלפים</span>
            </div>
          )}
          {showHundreds && (
            <div className="flex flex-col items-center gap-3">
              <MontessoriBlock id="src-hundred" type="hundred" isDraggable />
              <span className="text-sm sm:text-lg font-bold text-gray-500">מאות</span>
            </div>
          )}
          <div className="flex flex-col items-center gap-3">
            <MontessoriBlock id="src-ten" type="ten" isDraggable />
            <span className="text-sm sm:text-lg font-bold text-gray-500">עשרות</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <MontessoriBlock id="src-unit" type="unit" isDraggable />
            <span className="text-sm sm:text-lg font-bold text-gray-500">אחדות</span>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDragType ? <MontessoriBlock id="overlay" type={activeDragType} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <div className="bg-gray-100 pb-8 pt-4 flex justify-center">
        <button 
          onClick={store.checkAnswer}
          disabled={store.placedBlocks.length === 0}
          className="py-4 px-16 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold text-3xl rounded-full shadow-lg transition-transform active:scale-95"
        >
          בדוק אותי!
        </button>
      </div>
    </div>
  );
}
