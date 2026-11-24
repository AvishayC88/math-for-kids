import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { PlaceValue } from '../domain/types';
import { Block, fitScale } from '../art/Block';
import { useElementSize } from '../art/useElementSize';
import { Guide, GuideText } from './Guide';
import { AnswerSlot, NumberPad } from './NumberPad';
import { CheckButton } from './CheckButton';
import { SkipButton } from './SkipButton';
import { WEB_SCALE } from './blocks';

// Left to right, the way the number is written: thousands first.
const ORDER: PlaceValue[] = ['thousand', 'hundred', 'ten', 'unit'];
const COLUMNS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' } as const;
const GAP = 8;
const COLUMN_GAP = 16;

// Recognize: count the blocks and type the number.
export function RecognizeScreen() {
  const target = useGameStore(state => state.currentTargetNumber);
  const placedBlocks = useGameStore(state => state.placedBlocks);
  const interactionState = useGameStore(state => state.interactionState);
  const feedbackMessage = useGameStore(state => state.feedbackMessage);
  const lastReward = useGameStore(state => state.lastReward);
  const checkRecognizeAnswer = useGameStore(state => state.checkRecognizeAnswer);
  const [answer, setAnswer] = useState('');
  const solved = interactionState === 'success';

  useEffect(() => { setAnswer(''); }, [target]);
  const submit = useCallback(() => {
    const value = parseInt(answer, 10);
    if (!isNaN(value)) checkRecognizeAnswer(value);
  }, [answer, checkRecognizeAnswer]);

  const groups = ORDER
    .map(type => ({ type, blocks: placedBlocks.filter(block => block.type === type) }))
    .filter(group => group.blocks.length > 0);
  const area = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(area);
  const cellWidth = groups.length ? (width - COLUMN_GAP * (groups.length - 1)) / groups.length : 0;

  return (
    <>
      <Guide mood={solved ? 'happy' : interactionState === 'error' ? 'encourage' : 'asks'}>
        <GuideText task="איזה מספר כתוב כאן?" state={interactionState} feedback={feedbackMessage} celebration="נכון מאוד!" reward={lastReward} />
        <span dir="ltr" className="relative shrink-0 text-[clamp(36px,9vw,56px)] leading-none font-extrabold">
          <AnswerSlot value={answer} correct={solved} />
        </span>
      </Guide>

      {/* Blocks on the left and the pad on the right on a wide screen; blocks above the pad on a phone. */}
      <div className="mt-[18px] flex flex-col sm:flex-row-reverse items-stretch gap-5">
        <section aria-label="הקוביות" className="relative h-[260px] sm:h-auto sm:flex-1 rounded-3xl bg-card shadow-tray">
          <div ref={area} dir="ltr"
            className={`absolute inset-4 grid grid-rows-1 ${COLUMNS[Math.max(1, groups.length) as 1 | 2 | 3 | 4]} gap-4 overflow-y-auto overscroll-contain`}>
            {groups.map(group => {
              // Each place value fits its own column, so a full hundreds column never shrinks the units.
              const scale = fitScale(group.type, group.blocks.length, cellWidth, height, GAP, 0.4, WEB_SCALE);
              return (
                <div key={group.type} className="flex flex-wrap justify-center content-end gap-2">
                  {group.blocks.map(block => <Block key={block.id} type={block.type} scale={scale} />)}
                </div>
              );
            })}
          </div>
        </section>

        <div className="sm:w-[340px] shrink-0 flex flex-col gap-2.5">
          <NumberPad value={answer} onChange={setAnswer} onSubmit={submit} disabled={solved} />
          <CheckButton onCheck={submit} canCheck={!!answer} nextLabel="השלב הבא מגיע…" />
          <p className="text-center text-[13px] text-muted">אפשר גם להקליד במקלדת וללחוץ Enter</p>
        </div>
      </div>

      <div className="mt-1.5 self-center"><SkipButton label="דלגו על השלב" /></div>
    </>
  );
}
