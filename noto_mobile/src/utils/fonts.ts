export const FontFamily = {
  // Use system fonts with fallback (swap with custom fonts after installing)
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
  light: 'System',
  mono: 'Courier New',

  // After installing custom fonts, replace with:
  // regular: 'SpaceGrotesk-Regular',   // <-- swap to your preferred font
  // medium: 'SpaceGrotesk-Medium',
  // semiBold: 'SpaceGrotesk-SemiBold',
  // bold: 'SpaceGrotesk-Bold',
  // light: 'SpaceGrotesk-Light',
  // mono: 'JetBrainsMono-Regular',
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
  '5xl': 42,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};
