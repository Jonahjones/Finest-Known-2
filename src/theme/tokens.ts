// Luxury Dark Theme Tokens for React Native
export const luxeTokens = {
  colors: {
    bg: '#0b0b0b',
    bgElev: '#111111',
    surface: '#151515',
    line: '#262626',
    text: '#f5f5f5',
    muted: '#b5b5b5',
    gold: '#d4af37',
    gold600: '#b8902f',
    accent: '#8a7b5a',
    danger: '#ff5a5a',
    success: '#32c36a',
  },
  borderRadius: {
    sm: 10,
    md: 16,
    lg: 24,
    xl: 28,
  },
  shadows: {
    luxe1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 3,
    },
    luxe2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.28,
      shadowRadius: 24,
      elevation: 8,
    },
  },
  typography: {
    display: 'Playfair Display',
    sans: 'Inter',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
} as const;

export type LuxeTokens = typeof luxeTokens;
