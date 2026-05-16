export const Colors = {
  // Background layers
  bg: {
    primary: '#0A0A0F',
    secondary: '#111118',
    card: '#16161E',
    elevated: '#1C1C26',
    modal: '#13131A',
    input: '#1A1A24',
  },

  // Neon Blue Accents
  accent: {
    primary: '#00C2FF',
    secondary: '#0088CC',
    glow: 'rgba(0, 194, 255, 0.15)',
    glowStrong: 'rgba(0, 194, 255, 0.35)',
    muted: 'rgba(0, 194, 255, 0.08)',
  },

  // Text
  text: {
    primary: '#F0F0F8',
    secondary: '#8888A8',
    muted: '#55556A',
    inverse: '#0A0A0F',
    accent: '#00C2FF',
    success: '#0ef7b1ff',
  },

  // Borders
  border: {
    default: '#222230',
    subtle: '#1A1A24',
    accent: 'rgba(0, 194, 255, 0.4)',
    focus: '#00C2FF',
  },

  // Status
  status: {
    success: '#00E5A0',
    error: '#FF4D6A',
    warning: '#FFB800',
    info: '#00C2FF',
  },

  // Misc
  overlay: 'rgba(0, 0, 0, 0.75)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKeys = typeof Colors;
