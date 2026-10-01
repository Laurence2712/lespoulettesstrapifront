import { Platform } from 'react-native';

/** Brand palette — the only raw hex values allowed in the codebase. */
export const palette = {
  midnight: '#101B24',
  midnightRaised: '#16242F',
  midnightHigh: '#1E2F3B',
  forest: '#203B34',
  forestDeep: '#172C27',
  sage: '#A4D5B9',
  sageSoft: '#CFE8DA',
  ivory: '#F4F2EC',
  ivoryDeep: '#E9E5DA',
  white: '#FFFFFF',
  ink: '#0B141B',
  slate: '#5E6B73',
  mist: '#93A1A9',
  coral: '#E8876B',
  amber: '#E6B85C',
  danger: '#E5675A',
} as const;

export type ColorScheme = 'dark' | 'light';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentText: string;
  accentSoft: string;
  danger: string;
  overlay: string;
  tabBar: string;
  mapPin: string;
};

export const colors: Record<ColorScheme, ThemeColors> = {
  dark: {
    background: palette.midnight,
    surface: palette.midnightRaised,
    surfaceRaised: palette.midnightHigh,
    border: 'rgba(244,242,236,0.08)',
    text: palette.ivory,
    textMuted: 'rgba(244,242,236,0.68)',
    textSubtle: 'rgba(244,242,236,0.42)',
    accent: palette.sage,
    accentText: palette.midnight,
    accentSoft: 'rgba(164,213,185,0.14)',
    danger: palette.danger,
    overlay: 'rgba(8,14,19,0.72)',
    tabBar: 'rgba(16,27,36,0.96)',
    mapPin: palette.sage,
  },
  light: {
    background: palette.ivory,
    surface: palette.white,
    surfaceRaised: palette.ivoryDeep,
    border: 'rgba(16,27,36,0.08)',
    text: palette.midnight,
    textMuted: 'rgba(16,27,36,0.68)',
    textSubtle: 'rgba(16,27,36,0.45)',
    accent: palette.forest,
    accentText: palette.ivory,
    accentSoft: 'rgba(32,59,52,0.10)',
    danger: '#C2483B',
    overlay: 'rgba(16,27,36,0.45)',
    tabBar: 'rgba(255,255,255,0.97)',
    mapPin: palette.forest,
  },
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/** Serif for titles (travel-journal feel), system sans for everything else. */
const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });

export const typography = {
  display: { fontFamily: serif, fontSize: 34, lineHeight: 40, fontWeight: '400' as const, letterSpacing: -0.5 },
  title: { fontFamily: serif, fontSize: 24, lineHeight: 30, fontWeight: '400' as const, letterSpacing: -0.2 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  bodyStrong: { fontSize: 16, lineHeight: 23, fontWeight: '600' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700' as const, letterSpacing: 1.6, textTransform: 'uppercase' as const },
} as const;

export type TypographyVariant = keyof typeof typography;

/** Minimum touch target (Apple HIG 44pt, Material 48dp). */
export const HIT_TARGET = 48;
