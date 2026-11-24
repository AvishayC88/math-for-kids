import { useEffect } from 'react';
import { BackspaceIcon, CheckIcon } from '../art/icons';
import { palette } from '../art/palette';

const MAX_DIGITS = 4; // No answer in the game is longer than 4 digits.
const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

interface PadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

// Always open, so the answer is typed straight into the slot in the question.
// The computer keyboard types into the slot too, and Enter checks the answer.
export function NumberPad({ value, onChange, onSubmit, disabled }: PadProps) {
  const add = (digit: string) => { if (!disabled && value.length < MAX_DIGITS) onChange(value + digit); };
  const remove = () => { if (!disabled) onChange(value.slice(0, -1)); };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (disabled || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        if (value.length < MAX_DIGITS) onChange(value + event.key);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        onChange(value.slice(0, -1));
      } else if (event.key === 'Enter' && value) {
        event.preventDefault();
        onSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [value, onChange, onSubmit, disabled]);

  const key = 'h-14 rounded-[14px] text-[26px] font-bold shadow-key transition-transform enabled:active:translate-y-0.5';
  return (
    <section dir="ltr" aria-label="מקלדת מספרים"
      className={`grid grid-cols-3 gap-2 transition-opacity ${disabled ? 'opacity-40' : ''}`}>
      {DIGITS.map(digit => (
        <button key={digit} type="button" disabled={disabled} onClick={() => add(digit)} className={`${key} bg-card text-ink enabled:hover:bg-halo`}>{digit}</button>
      ))}
      <button type="button" disabled={disabled} onClick={() => add('0')} className={`${key} col-span-2 bg-card text-ink enabled:hover:bg-halo`}>0</button>
      <button type="button" disabled={disabled} onClick={remove} aria-label="מחיקת ספרה"
        className={`${key} bg-chip flex items-center justify-center`}>
        <BackspaceIcon size={26} color={palette.icon} />
      </button>
    </section>
  );
}

// The answer box inside the question. Sized in em, so it follows the question's font size.
export function AnswerSlot({ value, correct }: { value: string; correct: boolean }) {
  return (
    <span aria-label={`התשובה: ${value || 'עוד לא נכתבה'}`}
      className={`min-w-[1.65em] h-[1.28em] px-[.2em] inline-flex items-center justify-center gap-1 rounded-[.26em] ring-[3px] ring-inset ${
        correct ? 'bg-success-bg text-success-text ring-success-line' : 'bg-accent-soft text-accent ring-accent'
      }`}>
      {value}
      {correct
        ? <CheckIcon size={24} color={palette.success.line} />
        : <span aria-hidden="true" className="caret-blink w-1 h-[.75em] rounded-sm bg-accent" />}
    </span>
  );
}
