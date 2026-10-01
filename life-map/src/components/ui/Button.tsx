import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { HIT_TARGET } from '@/theme/tokens';

import { Text } from './Text';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  testID?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  disabled,
  fullWidth,
  style,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const { colors, radius, spacing } = useTheme();
  const inactive = disabled || loading;
  const bg = { primary: colors.accent, secondary: colors.surfaceRaised, ghost: 'transparent', danger: colors.danger }[variant];
  const fg = { primary: colors.accentText, secondary: colors.text, ghost: colors.accent, danger: '#FFFFFF' }[variant];

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        haptic.tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: radius.pill,
          minHeight: size === 'md' ? HIT_TARGET + 4 : 40,
          paddingHorizontal: size === 'md' ? spacing.xl : spacing.lg,
          opacity: inactive ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          alignSelf: fullWidth ? 'stretch' : 'auto',
          borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={size === 'md' ? 20 : 16} color={fg} /> : null}
          <Text variant={size === 'md' ? 'bodyStrong' : 'caption'} style={{ color: fg, fontWeight: '600' }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  tone = 'surface',
  size = 44,
  badge,
}: {
  icon: IconName;
  onPress: () => void;
  label: string;
  tone?: 'surface' | 'accent' | 'plain';
  size?: number;
  badge?: boolean;
}) {
  const { colors } = useTheme();
  const bg = { surface: colors.surface, accent: colors.accent, plain: 'transparent' }[tone];
  const fg = tone === 'accent' ? colors.accentText : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={() => {
        haptic.tap();
        onPress();
      }}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
        borderWidth: tone === 'surface' ? StyleSheet.hairlineWidth : 0,
        borderColor: colors.border,
      })}
    >
      <Ionicons name={icon} size={Math.round(size * 0.48)} color={fg} />
      {badge ? <View style={[styles.badge, { backgroundColor: colors.accent, borderColor: colors.background }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { position: 'absolute', top: 8, right: 9, width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
});
