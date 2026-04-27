import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useGameStore } from '../store/useGameStore';
import { PlaceValue } from '../domain/types';
import { DropZone } from './DropZone';
import { Toolbox } from './Toolbox';
import { MontessoriBlock } from './MontessoriBlock';

export function GameScreen() {
  const store = useGameStore();
  const [activeDragType, setActiveDragType] = useState<PlaceValue | null>(null);

  // Derived state for the zones
  const unitsBlocks = store.placedBlocks.filter(b => b.type === 'unit');
  const tensBlocks = store.placedBlocks.filter(b => b.type === 'ten');

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragType(active.data.current?.type);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragType(null);

    // If dropped outside a valid zone, do nothing
    if (!over) return;

    const droppedType = active.data.current?.type as PlaceValue;
    const targetAccepts = over.data.current?.accepts as PlaceValue;

    // Strict Montessori rule: Units only to unit zone, tens only to tens zone
    if (droppedType === targetAccepts) {
      store.addBlock(droppedType);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 flex flex-col h-screen font-sans" dir="rtl">
      {/* Header & Control of Error */}
      <div className="text-center pb-6">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          בני את המספר: <span className="text-purple-600">{store.currentTargetNumber}</span>
        </h1>
        
        {/* Error Feedback Component */}
        {store.interactionState === 'error' && (
          <div className="mt-4 p-4 max-w-lg mx-auto bg-orange-100 text-orange-800 rounded-xl border border-orange-200 shadow-sm animate-bounce">
            <span className="font-bold text-xl">
              שמנו {tensBlocks.length} עשרות ו-{unitsBlocks.length} אחדות. זה {tensBlocks.length * 10 + unitsBlocks.length}. אנחנו צריכים {store.currentTargetNumber}.
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

      {/* Workspace Context */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 flex-1 px-4">
          <DropZone id="zone-unit" type="unit" title="אחדות (ירוק)" blocks={unitsBlocks} />
          <DropZone id="zone-ten" type="ten" title="עשרות (כחול)" blocks={tensBlocks} />
        </div>

        <Toolbox />

        {/* The DragOverlay is critical for 60fps animations during drag */}
        <DragOverlay>
          {activeDragType ? <MontessoriBlock id="overlay" type={activeDragType} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Validation Action */}
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
