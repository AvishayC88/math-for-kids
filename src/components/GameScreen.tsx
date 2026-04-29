import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useGameStore } from '../store/useGameStore';
import { PlaceValue } from '../domain/types';
import { DropZone } from './DropZone';
import { MontessoriBlock } from './MontessoriBlock';

export function GameScreen() {
  const store = useGameStore();
  const [activeDragType, setActiveDragType] = useState<PlaceValue | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [moveCount, setMoveCount] = useState(0);

  const pushLog = (line: string) => {
    setDebugLog((prev) => [`${new Date().toLocaleTimeString().slice(3)} ${line}`, ...prev].slice(0, 8));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const unitsBlocks = store.placedBlocks.filter((b) => b.type === 'unit');
  const tensBlocks = store.placedBlocks.filter((b) => b.type === 'ten');
  const hundredsBlocks = store.placedBlocks.filter((b) => b.type === 'hundred');
  const thousandsBlocks = store.placedBlocks.filter((b) => b.type === 'thousand');

  const showHundreds = store.currentTargetNumber >= 100;
  const showThousands = store.currentTargetNumber >= 1000;

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setMoveCount(0);
    pushLog(`START ${String(active.id)} (${active.data.current?.type})`);
    setActiveDragType(active.data.current?.type);
  };

  const handleDragMove = (_event: DragMoveEvent) => {
    setMoveCount((c) => c + 1);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const droppedType = active.data.current?.type as PlaceValue | undefined;
    const targetAccepts = over?.data.current?.accepts as PlaceValue | undefined;
    pushLog(
      `END over=${over?.id ?? 'null'} drop=${droppedType ?? '?'} accepts=${targetAccepts ?? '?'} moves=${moveCount}`
    );
    setActiveDragType(null);

    if (!over) return;
    if (droppedType && droppedType === targetAccepts) {
      store.addBlock(droppedType);
    }
  };

  return (
    <div
      className="h-[100dvh] w-full pt-4 flex flex-col font-sans select-none overflow-hidden bg-white"
      dir="rtl"
    >
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full h-full overflow-hidden">
        <div
          dir="ltr"
          className="bg-black text-green-300 text-xs leading-tight font-mono p-2 mx-1 mb-1 rounded shrink-0 whitespace-pre border-2 border-yellow-400"
        >
          {`DEBUG v3 | active=${activeDragType ?? '-'} moves=${moveCount}`}
          {debugLog.length === 0 ? '\n(no events yet)' : debugLog.map((l) => `\n${l}`).join('')}
        </div>
        <div className="text-center pb-2 sm:pb-6 shrink-0 px-2">
          <h1 className="text-2xl sm:text-5xl font-extrabold text-gray-800 mb-2">
            בני את המספר: <span className="text-purple-600">{store.currentTargetNumber}</span>
          </h1>

          {store.interactionState === 'error' && store.feedbackMessage && (
            <div className="mt-1 p-2 sm:p-4 max-w-lg mx-auto bg-orange-100 text-orange-800 rounded-xl border border-orange-200 shadow-sm animate-bounce">
              <span className="font-bold text-sm sm:text-xl">{store.feedbackMessage}</span>
            </div>
          )}

          {store.interactionState === 'success' && (
            <div className="mt-1 p-2 sm:p-4 max-w-lg mx-auto bg-green-100 text-green-800 rounded-xl shadow-sm text-sm sm:text-2xl font-bold">
              אלופה! אספת עוד 10 מטבעות! (סה"כ: {store.coinsCollected})
            </div>
          )}
        </div>

        <DndContext
          sensors={sensors}
          autoScroll={false}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-row gap-1 sm:gap-4 flex-1 px-1 sm:px-4 w-full flex-nowrap items-stretch pb-2">
            <DropZone
              id="zone-unit"
              type="unit"
              title="אחדות"
              blocks={unitsBlocks}
              onRemoveBlock={store.removeBlock}
            />
            <DropZone
              id="zone-ten"
              type="ten"
              title="עשרות"
              blocks={tensBlocks}
              onRemoveBlock={store.removeBlock}
            />
            {showHundreds && (
              <DropZone
                id="zone-hundred"
                type="hundred"
                title="מאות"
                blocks={hundredsBlocks}
                onRemoveBlock={store.removeBlock}
              />
            )}
            {showThousands && (
              <DropZone
                id="zone-thousand"
                type="thousand"
                title="אלפים"
                blocks={thousandsBlocks}
                onRemoveBlock={store.removeBlock}
              />
            )}
          </div>

          <div className="w-full bg-gray-100 p-3 sm:p-6 rounded-t-3xl shadow-inner border-t-4 border-gray-200 mt-auto shrink-0 flex flex-row justify-around items-end relative z-10 flex-nowrap">
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

        <div className="bg-gray-100 pb-4 pt-1 sm:pt-2 shrink-0 flex justify-center w-full relative z-20">
          <button
            onClick={store.checkAnswer}
            disabled={store.placedBlocks.length === 0}
            className="py-2 sm:py-4 px-8 sm:px-16 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold text-xl sm:text-3xl rounded-full shadow-lg transition-transform active:scale-95"
          >
            בדוק אותי!
          </button>
        </div>
      </div>
    </div>
  );
}
