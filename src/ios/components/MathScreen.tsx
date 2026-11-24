import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import type { MathProblem, MontessoriBlock as BlockData } from '../../domain/types';
import { Block } from '../../art/Block';
import { LifebuoyIcon } from '../../art/icons';
import { palette } from '../../art/palette';
import { Guide, GuideText } from './Guide';
import { AnswerSlot, NumberPad } from './NumberPad';
import { ActionArea } from './ActionArea';

const SIGN = { '+': '+', '-': '−', '*': '×', '/': '÷' } as const;
// Lifeline blocks start at this size and shrink, down to MIN_SCALE, until they all fit.
const LIFELINE_SCALE = 0.75;
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
  // Long numbers shrink the whole equation so it stays on one line; an open lifeline shrinks it too.
  const length = String(num1).length + String(num2).length + Math.max(answer.length, 2);
  const fontSize = (length <= 6 ? 56 : length <= 8 ? 46 : 38) * (isLifelineUsed ? 0.75 : 1);

  return (
    <>
      <Guide mood={solved ? 'happy' : interactionState === 'error' ? 'encourage' : 'asks'}>
        <GuideText task="כמה זה?" state={interactionState} feedback={feedbackMessage} celebration="תשובה נכונה!" reward={lastReward} />
      </Guide>

      <section aria-label="התרגיל" className={`mt-3 shrink-0 px-3 ${isLifelineUsed ? 'py-3' : 'py-[18px]'} rounded-3xl bg-card shadow-card flex justify-center`}>
        <div dir="ltr" className="flex items-center gap-[.2em] font-extrabold text-ink leading-none" style={{ fontSize }}>
          <span>{num1}</span>
          <span className="text-[.72em] font-bold text-accent-muted">{SIGN[operator]}</span>
          <span>{num2}</span>
          <span className="text-[.72em] font-bold text-accent-muted">=</span>
          <AnswerSlot value={answer} correct={solved} />
        </div>
      </section>

      <div className="mt-3 flex-1 min-h-0 flex flex-col items-center">
        {isLifelineUsed ? (
          <Lifeline key={`${num1}${operator}${num2}`} problem={problem} blocks={placedBlocks} onToggle={toggleBlockGhostState} />
        ) : (
          <button type="button" onClick={showLifeline} disabled={solved}
            className="h-11 px-[18px] shrink-0 rounded-full bg-place-ten-tint text-place-ten-text text-[15px] font-bold flex items-center gap-2 disabled:opacity-40">
            <LifebuoyIcon size={20} color={palette.place.ten.text} />
            גלגל הצלה
          </button>
        )}
      </div>

      <div className="mt-3 shrink-0">
        <NumberPad value={answer} onChange={setAnswer} onSubmit={submit} disabled={solved} compact={isLifelineUsed} />
      </div>
      <ActionArea onCheck={submit} canCheck={!!answer} skipLabel="דלגו על התרגיל" nextLabel="התרגיל הבא מגיע…" />
    </>
  );
}

// The lifeline shows the exercise with blocks. The blocks shrink until everything fits;
// at the smallest size the area scrolls.
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
    <div ref={box} className="w-full h-full overflow-y-auto overscroll-contain">
      <LifelineBlocks {...props} scale={scale} />
    </div>
  );
}

interface LifelineProps {
  problem: MathProblem;
  blocks: BlockData[];
  onToggle: (id: string) => void;
}

function LifelineBlocks({ problem, blocks, onToggle, scale }: LifelineProps & { scale: number }) {
  const { num1, num2, operator } = problem;
  const group = (id: number) => blocks.filter(block => block.groupId === id);

  if (operator === '+') {
    return (
      <div dir="ltr" className="w-full flex items-center justify-center gap-2">
        <BlockGroup blocks={group(1)} scale={scale} />
        <span className="text-3xl font-bold text-accent-muted">+</span>
        <BlockGroup blocks={group(2)} scale={scale} />
      </div>
    );
  }

  if (operator === '-') {
    return (
      <div className="w-full flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-muted">החסירו {num2} קוביות (לחצו עליהן)</p>
        <div dir="ltr" className="w-full p-3 rounded-2xl bg-card shadow-card flex flex-wrap justify-center items-end gap-1.5">
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
    <div className="w-full flex flex-col items-center gap-2">
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
    <div className="flex-1 p-1.5 rounded-xl bg-card shadow-card flex flex-wrap justify-center items-end gap-1">
      {blocks.map(block => <Block key={block.id} type={block.type} scale={scale} />)}
    </div>
  );
}
