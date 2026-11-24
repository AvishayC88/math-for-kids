import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { MathProblem, MontessoriBlock as BlockData } from '../domain/types';
import { Block } from '../art/Block';
import { LifebuoyIcon } from '../art/icons';
import { palette } from '../art/palette';
import { Guide, GuideText } from './Guide';
import { AnswerSlot, NumberPad } from './NumberPad';
import { CheckButton } from './CheckButton';
import { SkipButton } from './SkipButton';

const SIGN = { '+': '+', '-': '−', '*': '×', '/': '÷' } as const;
// Lifeline blocks start at full size and shrink, down to MIN_SCALE, until they all fit.
const LIFELINE_SCALE = 1;
const MIN_SCALE = 0.4;
// Groups of a × or ÷ lifeline sit in a near-square grid: up to 3 side by side, then 2, 3, 4 or 5 per row.
const GROUP_COLUMNS = ['grid-cols-1', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-2', 'grid-cols-3', 'grid-cols-3', 'grid-cols-4', 'grid-cols-4', 'grid-cols-5', 'grid-cols-5'];

// Exercises: the answer is typed straight into the equation.
export function MathScreen() {
  const problem = useGameStore(state => state.currentMathProblem);
  const placedBlocks = useGameStore(state => state.placedBlocks);
  const interactionState = useGameStore(state => state.interactionState);
  const feedbackMessage = useGameStore(state => state.feedbackMessage);
  const lastReward = useGameStore(state => state.lastReward);
  const isLifelineUsed = useGameStore(state => state.isLifelineUsed);
  const showLifeline = useGameStore(state => state.useLifeline);
  const toggleBlockGhostState = useGameStore(state => state.toggleBlockGhostState);
  const checkMathAnswer = useGameStore(state => state.checkMathAnswer);
  const [answer, setAnswer] = useState('');
  const solved = interactionState === 'success';

  useEffect(() => { setAnswer(''); }, [problem]);
  const submit = useCallback(() => {
    const value = parseInt(answer, 10);
    if (!isNaN(value)) checkMathAnswer(value);
  }, [answer, checkMathAnswer]);

  if (!problem) return null;
  const { num1, num2, operator } = problem;
  // Long numbers shrink the equation so it stays on one line; a narrow screen shrinks it too.
  const length = String(num1).length + String(num2).length + Math.max(answer.length, 2);
  const largest = length <= 6 ? 84 : length <= 8 ? 72 : 60;

  return (
    <>
      <Guide mood={solved ? 'happy' : interactionState === 'error' ? 'encourage' : 'asks'}>
        <GuideText task="כמה זה?" state={interactionState} feedback={feedbackMessage} celebration="תשובה נכונה!" reward={lastReward} />
      </Guide>

      <section aria-label="התרגיל" className="mt-3.5 self-center w-[min(640px,100%)] px-4 py-5 rounded-[28px] bg-card shadow-card flex justify-center">
        <div dir="ltr" className="flex items-center gap-[.22em] font-extrabold text-ink leading-none"
          style={{ fontSize: `clamp(34px, 9vw, ${largest}px)` }}>
          <span>{num1}</span>
          <span className="text-[.72em] font-bold text-accent-muted">{SIGN[operator]}</span>
          <span>{num2}</span>
          <span className="text-[.72em] font-bold text-accent-muted">=</span>
          <AnswerSlot value={answer} correct={solved} />
        </div>
      </section>

      {/* The pad on the right and the lifeline on the left on a wide screen; stacked on a phone. */}
      <div className="mt-[18px] flex flex-col sm:flex-row items-stretch justify-center gap-5">
        <div className="sm:w-[340px] shrink-0 flex flex-col gap-2.5">
          <NumberPad value={answer} onChange={setAnswer} onSubmit={submit} disabled={solved} />
          <CheckButton onCheck={submit} canCheck={!!answer} nextLabel="התרגיל הבא מגיע…" />
          <p className="text-center text-[13px] text-muted">אפשר גם להקליד במקלדת וללחוץ Enter</p>
        </div>

        {/* On a phone an open lifeline moves above the pad, where it is seen. */}
        <section aria-label="גלגל הצלה"
          className={`${isLifelineUsed ? 'order-first sm:order-none h-[280px]' : 'h-[320px]'} sm:h-auto sm:flex-1 sm:max-w-[440px] p-5 rounded-3xl bg-card shadow-card flex flex-col`}>
          {isLifelineUsed ? (
            <Lifeline key={`${num1}${operator}${num2}`} problem={problem} blocks={placedBlocks} onToggle={toggleBlockGhostState} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-[72px] h-[72px] rounded-full bg-place-ten-tint flex items-center justify-center">
                <LifebuoyIcon size={36} color={palette.place.ten.text} />
              </div>
              <p className="text-[19px] font-bold">צריכים עזרה?</p>
              <p className="text-[15px] text-muted">הקוביות יראו לכם את התרגיל</p>
              <button type="button" onClick={showLifeline} disabled={solved}
                className="mt-1 h-11 px-5 rounded-full bg-place-ten-tint text-place-ten-text text-[15px] font-bold enabled:hover:brightness-95 disabled:opacity-40">
                גלגל הצלה
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="mt-1.5 self-center"><SkipButton label="דלגו על התרגיל" /></div>
    </>
  );
}

interface LifelineProps {
  problem: MathProblem;
  blocks: BlockData[];
  onToggle: (id: string) => void;
}

// The lifeline shows the exercise with blocks. The blocks shrink until everything fits;
// at the smallest size the area scrolls. The area is positioned over its box, so the blocks
// never stretch the page.
function Lifeline(props: LifelineProps) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(LIFELINE_SCALE);
  useLayoutEffect(() => {
    const element = box.current;
    if (element && element.scrollHeight > element.clientHeight + 1 && scale > MIN_SCALE) {
      setScale(Math.max(MIN_SCALE, Math.round((scale - 0.05) * 100) / 100));
    }
  });
  return (
    <>
      <p className="text-center text-[15px] font-medium text-muted">גלגל הצלה</p>
      <div className="relative mt-3 flex-1 min-h-0">
        <div ref={box} className="absolute inset-0 overflow-y-auto overscroll-contain">
          <LifelineBlocks {...props} scale={scale} />
        </div>
      </div>
      <p className="mt-3 text-center text-[13px] text-muted">עם גלגל הצלה מקבלים חצי מהכוכבים</p>
    </>
  );
}

function LifelineBlocks({ problem, blocks, onToggle, scale }: LifelineProps & { scale: number }) {
  const { num1, num2, operator } = problem;
  const group = (id: number) => blocks.filter(block => block.groupId === id);

  if (operator === '+') {
    return (
      <div dir="ltr" className="min-h-full flex items-center justify-center gap-3">
        <BlockGroup blocks={group(1)} scale={scale} />
        <span className="text-3xl font-bold text-accent-muted">+</span>
        <BlockGroup blocks={group(2)} scale={scale} />
      </div>
    );
  }

  if (operator === '-') {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-muted">החסירו {num2} קוביות (לחצו עליהן)</p>
        <div dir="ltr" className="w-full p-3 rounded-2xl bg-place-unit-tint shadow-sunk flex flex-wrap justify-center items-end gap-1.5">
          {blocks.map(block => (
            <button key={block.id} type="button" onClick={() => onToggle(block.id)} aria-pressed={!!block.isGhosted}
              aria-label={block.isGhosted ? 'החזרת הקובייה' : 'הורדת הקובייה'}
              className={`-m-1 p-1 rounded-lg transition-opacity ${block.isGhosted ? 'opacity-25 grayscale' : ''}`}>
              <Block type={block.type} scale={scale} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const groups = operator === '*' ? num1 : num2;
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-medium text-muted">
        {operator === '*' ? `יש כאן ${num1} קבוצות של ${num2}` : `חילקנו ${num1} ל-${num2} קבוצות שוות`}
      </p>
      <div dir="ltr" className={`w-full grid gap-1.5 ${GROUP_COLUMNS[Math.min(groups, 10)]}`}>
        {Array.from({ length: groups }, (_, index) => <BlockGroup key={index} blocks={group(index + 1)} scale={scale} />)}
      </div>
    </div>
  );
}

function BlockGroup({ blocks, scale }: { blocks: BlockData[]; scale: number }) {
  return (
    <div className="flex-1 p-2 rounded-xl bg-place-unit-tint shadow-sunk flex flex-wrap justify-center items-end gap-1">
      {blocks.map(block => <Block key={block.id} type={block.type} scale={scale} />)}
    </div>
  );
}
