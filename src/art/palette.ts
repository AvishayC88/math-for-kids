// Colours of the redesign. Both interfaces' Tailwind configs and the drawings in this folder read them,
// so a colour is changed in one place.
export const palette = {
  paper: '#F7F4EE',
  card: '#FFFFFF',
  ink: '#2B2440',
  muted: '#5F5870',
  track: '#ECE6DC',
  chip: '#EEE8DE',
  lip: '#E7E1F3',
  icon: '#4B4560',
  halo: '#F3EEE6',
  accent: { DEFAULT: '#5B47D6', dark: '#4433B0', soft: '#EEEAFC', muted: '#8C80DC' },
  star: { bg: '#FFF1CC', text: '#6B4E00', icon: '#F2B200' },
  success: { bg: '#E6F5EA', line: '#22A355', text: '#14532D' },
  // Block colours are the Montessori classroom colours; keep them as they are.
  place: {
    unit: { block: '#22C55E', tint: '#E6F5EA', text: '#166534' },
    ten: { block: '#2563EB', tint: '#E8EEFC', text: '#1E40AF' },
    hundred: { block: '#EF4444', tint: '#FBEAEA', text: '#991B1B' },
    thousand: { block: '#047857', tint: '#E2F2EC', text: '#065F46' },
  },
};

export const fontFamily = ['"Rubik Variable"', 'system-ui', 'sans-serif'];

export const shadows = {
  card: '0 1px 2px rgba(60,40,20,.06), 0 6px 18px rgba(60,40,20,.06)',
  tray: '0 1px 2px rgba(60,40,20,.06), 0 10px 26px rgba(60,40,20,.08)',
  shelf: `inset 0 -8px 0 ${palette.lip}, 0 6px 18px rgba(60,40,20,.06)`,
  sunk: 'inset 0 2px 6px rgba(43,36,64,.12)',
  seg: '0 1px 3px rgba(43,36,64,.14)',
  key: '0 2px 0 #E6DFD3',
  press: `inset 0 -4px 0 ${palette.accent.dark}, 0 6px 16px rgba(91,71,214,.26)`,
};
