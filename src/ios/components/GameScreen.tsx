import { useState } from 'react';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { useGameStore } from '../../store/useGameStore';
import type { PlaceValue } from '../../domain/types';
import { PLACE_NAMES } from '../../domain/places';
import { Block } from '../../art/Block';
import { Guide, GuideText } from './Guide';
import { DropZone } from './DropZone';
import { SourceBlock } from './blocks';
import { ActionArea } from './ActionArea';

// Tailwind needs the full class names written out.
const COLUMNS = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' } as const;

// Build the number: drag blocks from the shelf into the tray.
export function GameScreen() {
  const target = useGameStore(state => state.currentTargetNumber);
  const placedBlocks = useGameStore(state => state.placedBlocks);
  const interactionState = useGameStore(state => state.interactionState);
  const feedbackMessage = useGameStore(state => state.feedbackMessage);
  const lastReward = useGameStore(state => state.lastReward);
  const addBlock = useGameStore(state => state.addBlock);
  const removeBlock = useGameStore(state => state.removeBlock);
  const checkAnswer = useGameStore(state => state.checkAnswer);
  const [dragging, setDragging] = useState<PlaceValue | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 6 } }),
  );

  // Right to left, like the digits: units first, then tens, hundreds, thousands.
  const places: PlaceValue[] = ['unit', 'ten'];
  if (target >= 100) places.push('hundred');
  if (target >= 1000) places.push('thousand');
  const columns = COLUMNS[places.length as 2 | 3 | 4];

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDragging(null);
    const type = active.data.current?.type as PlaceValue | undefined;
    if (type && over?.data.current?.accepts === type) addBlock(type);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragCancel={() => setDragging(null)}
      onDragStart={({ active }) => setDragging((active.data.current?.type as PlaceValue | undefined) ?? null)}>

      <Guide mood={interactionState === 'success' ? 'happy' : interactionState === 'error' ? 'encourage' : 'idle'}>
        <GuideText task="בנו את המספר" state={interactionState} feedback={feedbackMessage} celebration="כל הכבוד!" reward={lastReward} />
        <p className="relative text-[52px] leading-[60px] font-extrabold text-accent">{target}</p>
      </Guide>

      <section aria-label="מגש הבנייה" className={`mt-3 flex-1 min-h-0 grid grid-rows-1 ${columns} gap-2 p-2 rounded-3xl bg-card shadow-tray`}>
        {places.map(type => (
          <DropZone key={type} type={type} blocks={placedBlocks.filter(block => block.type === type)} onRemove={removeBlock} />
        ))}
      </section>

      <section aria-label="מדף הקוביות" className={`mt-3 shrink-0 grid ${columns} gap-2 items-end px-2 pt-3 rounded-t-[20px] rounded-b-xl bg-card shadow-shelf`}>
        {places.map(type => (
          <div key={type} className="flex flex-col items-center gap-1.5 pb-3.5">
            <SourceBlock type={type} />
            <span className="text-xs font-medium text-muted">{PLACE_NAMES[type]}</span>
          </div>
        ))}
      </section>

      <ActionArea onCheck={checkAnswer} canCheck={placedBlocks.length > 0} skipLabel="דלגו על השלב" nextLabel="השלב הבא מגיע…" />

      <DragOverlay dropAnimation={null}>{dragging && <Block type={dragging} />}</DragOverlay>
    </DndContext>
  );
}
