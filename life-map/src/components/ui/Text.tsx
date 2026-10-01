import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { TypographyVariant } from '@/theme/tokens';

type Tone = 'default' | 'muted' | 'subtle' | 'accent' | 'danger' | 'inverse';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  tone?: Tone;
  align?: 'left' | 'center' | 'right';
};

export function Text({ variant = 'body', tone = 'default', align, style, ...rest }: TextProps) {
  const { colors, typography } = useTheme();
  const color = {
    default: colors.text,
    muted: colors.textMuted,
    subtle: colors.textSubtle,
    accent: colors.accent,
    danger: colors.danger,
    inverse: colors.accentText,
  }[tone];
  return <RNText {...rest} style={[typography[variant], { color, textAlign: align }, style]} />;
}
