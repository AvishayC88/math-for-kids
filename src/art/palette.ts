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
