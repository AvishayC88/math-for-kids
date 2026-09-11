import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export function NumberAnswer({ value, onChange, onSubmit, disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const keypad = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => keypad.current?.scrollIntoView({ block: 'nearest' }));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  return (
    <div>
      <button
        type="button"
        aria-label="התשובה"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen(open => !open)}
        onKeyDown={event => {
          if (/^[0-9]$/.test(event.key)) {
            event.preventDefault();
            onChange(value + event.key);
          } else if (event.key === 'Backspace') {
            event.preventDefault();
            onChange(value.slice(0, -1));
          } else if (event.key === 'Enter' && value) {
            event.preventDefault();
            onSubmit();
          }
        }}
        className="w-full text-center text-3xl font-black text-purple-700 bg-purple-50 border-4 border-purple-300 rounded-2xl py-3"
      >
        {value || <span className="text-purple-400">התשובה היא...</span>}
      </button>
      {isOpen && !disabled && (
        <div ref={keypad} role="group" aria-label="מקלדת מספרים" className="grid grid-cols-3 gap-2 mt-3" dir="ltr">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
            <button key={digit} type="button" onClick={() => onChange(value + digit)}
              className="rounded-xl bg-purple-50 border border-purple-200 min-h-12 text-2xl font-bold text-purple-800 active:bg-purple-200">
              {digit}
            </button>
          ))}
          <button type="button" aria-label="מחיקת ספרה" onClick={() => onChange(value.slice(0, -1))}
            className="rounded-xl bg-gray-100 min-h-12 text-xl">⌫</button>
          <button type="button" onClick={() => onChange(value + '0')}
            className="rounded-xl bg-purple-50 border border-purple-200 min-h-12 text-2xl font-bold text-purple-800">0</button>
          <button type="button" onClick={() => setIsOpen(false)}
            className="rounded-xl bg-purple-600 text-white min-h-12 font-bold">סיום</button>
        </div>
      )}
    </div>
  );
}

