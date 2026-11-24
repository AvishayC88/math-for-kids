import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import type { DifficultyLevel, MathDifficultyLevel, MathProblem } from '../../domain/types';
import { CheckIcon, CloseIcon, LockIcon } from '../../art/icons';
import { palette } from '../../art/palette';
import { IconButton } from './IconButton';

type Operator = MathProblem['operator'];

const BUILD_LEVELS: { id: DifficultyLevel; label: string }[] = [
  { id: 'tens', label: 'עשרות' },
  { id: 'hundreds', label: 'מאות' },
  { id: 'thousands', label: 'אלפים' },
];
const MATH_LEVELS: { id: MathDifficultyLevel; label: string }[] = [
  { id: 'upTo10', label: 'עד 10' },
  { id: 'upTo20', label: 'עד 20' },
  { id: 'upTo100', label: 'עד 100' },
  { id: 'upTo1000', label: 'עד 1000' },
];
const OPERATORS: { id: Operator; label: string }[] = [
  { id: '+', label: 'חיבור +' },
  { id: '-', label: 'חיסור −' },
  { id: '*', label: 'כפל ×' },
  { id: '/', label: 'חילוק ÷' },
];

export function SettingsScreen({ onClose }: { onClose: () => void }) {
  const gameMode = useGameStore(state => state.gameMode);
  const difficulty = useGameStore(state => state.difficulty);
  const setDifficulty = useGameStore(state => state.setDifficulty);
  const mathDifficulty = useGameStore(state => state.mathDifficulty);
  const setMathDifficulty = useGameStore(state => state.setMathDifficulty);
  const lockedLevels = useGameStore(state => state.lockedLevels);
  const toggleLevelLock = useGameStore(state => state.toggleLevelLock);
  const allowedOperators = useGameStore(state => state.allowedOperators);
  const toggleOperator = useGameStore(state => state.toggleOperator);
  const [secretTaps, setSecretTaps] = useState(0);

  const isMathMode = gameMode === 'math';
  const levels = isMathMode ? MATH_LEVELS : BUILD_LEVELS;
  const selected = isMathMode ? mathDifficulty : difficulty;

  const selectLevel = (id: string) => {
    if (lockedLevels[id]) return;
    if (id !== selected) {
      if (isMathMode) setMathDifficulty(id as MathDifficultyLevel);
      else setDifficulty(id as DifficultyLevel);
    }
    onClose();
  };

  return (
    <div dir="rtl" className="safe-screen fixed inset-0 z-[100] bg-paper flex flex-col">
      <div className="flex-1 min-h-0 w-full max-w-xl mx-auto px-4 py-2 flex flex-col">
        <header className="h-11 shrink-0 flex items-center justify-between">
          {/* Five taps on the title open the parent controls. */}
          <h1 onClick={() => setSecretTaps(taps => taps + 1)} className="text-[22px] font-bold">הגדרות קושי</h1>
          <IconButton label="סגירת הגדרות" onClick={onClose}><CloseIcon color={palette.icon} /></IconButton>
        </header>

        <div className="mt-4 flex-1 min-h-0 overflow-y-auto overscroll-contain -mx-4 px-4 pb-6 flex flex-col gap-7">
          {secretTaps >= 5 && (
            <section className="p-4 rounded-[20px] bg-card shadow-card flex flex-col gap-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-place-hundred-text">
                <LockIcon size={18} color={palette.place.hundred.text} />
                בקרת הורים
              </h2>
              <p className="text-sm text-muted">לחצו כדי לנעול או לפתוח. רמה אחת תמיד נשארת פתוחה.</p>
              <div className="flex flex-wrap gap-2">
                {levels.map(level => (
                  <LockChip key={level.id} label={level.label} locked={!!lockedLevels[level.id]}
                    onClick={() => toggleLevelLock(level.id, isMathMode ? 'math' : 'build')} />
                ))}
              </div>
              {isMathMode && (
                <>
                  <p className="mt-1 text-sm text-muted">סוגי תרגילים (אחד תמיד נשאר פתוח)</p>
                  <div className="flex flex-wrap gap-2">
                    {OPERATORS.map(op => (
                      <LockChip key={op.id} label={op.label} locked={!!lockedLevels[op.id]} onClick={() => toggleLevelLock(op.id, 'operator')} />
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          <section className="flex flex-col gap-2.5">
            <h2 className="text-lg font-bold">{isMathMode ? 'רמת תרגילים' : 'רמת המספרים'}</h2>
            <p className="-mt-1 text-sm text-muted">{isMathMode ? 'בחרו את גבול התוצאה לתרגילים' : 'בחרו אילו מספרים יופיעו במשחק'}</p>
            {levels.map(level => {
              const locked = !!lockedLevels[level.id];
              const isSelected = level.id === selected;
              return (
                <button key={level.id} type="button" onClick={() => selectLevel(level.id)} disabled={locked} aria-pressed={isSelected}
                  className={`h-14 rounded-2xl text-xl font-bold flex items-center justify-center gap-2 ${
                    locked ? 'bg-card text-muted opacity-50'
                      : isSelected ? 'bg-accent-soft text-accent ring-2 ring-inset ring-accent'
                        : 'bg-card text-ink shadow-card'
                  }`}>
                  {level.label}
                  {locked && <LockIcon size={18} color={palette.muted} />}
                </button>
              );
            })}
          </section>

          {isMathMode && (
            <section className="flex flex-col gap-2.5">
              <h2 className="text-lg font-bold">סוגי תרגילים</h2>
              <p className="-mt-1 text-sm text-muted">בחרו אילו סוגי תרגילים יופיעו במשחק</p>
              <div className="grid grid-cols-2 gap-2.5">
                {OPERATORS.map(op => {
                  const locked = !!lockedLevels[op.id];
                  const active = allowedOperators.includes(op.id);
                  return (
                    <button key={op.id} type="button" onClick={() => toggleOperator(op.id)} disabled={locked} aria-pressed={active}
                      className={`h-12 rounded-xl text-lg font-bold flex items-center justify-center gap-2 ${
                        locked ? 'bg-card text-muted opacity-50'
                          : active ? 'bg-accent-soft text-accent ring-2 ring-inset ring-accent'
                            : 'bg-card text-muted shadow-card'
                      }`}>
                      {op.label}
                      {locked && <LockIcon size={16} color={palette.muted} />}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function LockChip({ label, locked, onClick }: { label: string; locked: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={locked}
      className={`h-11 px-4 rounded-full text-sm font-bold flex items-center gap-1.5 ${
        locked ? 'bg-place-hundred-tint text-place-hundred-text' : 'bg-place-unit-tint text-place-unit-text'
      }`}>
      {locked
        ? <LockIcon size={15} color={palette.place.hundred.text} />
        : <CheckIcon size={15} color={palette.place.unit.text} />}
      {label}
    </button>
  );
}
