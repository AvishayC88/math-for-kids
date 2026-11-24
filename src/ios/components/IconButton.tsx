import type { ReactNode } from 'react';

// A round 44px button holding an icon; the label is what screen readers announce.
export function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick}
      className="w-11 h-11 shrink-0 rounded-full bg-chip flex items-center justify-center transition-transform active:scale-95">
      {children}
    </button>
  );
}
