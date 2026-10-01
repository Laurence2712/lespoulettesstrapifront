import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

import { Text } from './Text';

/** Height reserved at the bottom of tab screens so content clears the floating tab bar. */
export const TAB_BAR_SPACE = 104;

export function Screen({
  children,
  scroll = true,
  withTabBar = false,
  edges = 'top',
  contentContainerStyle,
  ...scrollProps
}: {
  children: ReactNode;
  scroll?: boolean;
  withTabBar?: boolean;
  edges?: 'top' | 'none';
} & ScrollViewProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const paddingTop = edges === 'top' ? insets.top + spacing.sm : spacing.lg;
  const paddingBottom = (withTabBar ? TAB_BAR_SPACE : spacing.xxl) + insets.bottom;

  if (!scroll) {
    return <View style={[styles.flex, { backgroundColor: colors.background, paddingTop }]}>{children}</View>;
  }
  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={[{ paddingTop, paddingBottom, paddingHorizontal: spacing.lg, gap: spacing.lg }, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      {...scrollProps}
    >
      {children}
    </ScrollView>
  );
}

export function ScreenHeader({ overline, title, right }: { overline?: string; title: string; right?: ReactNode }) {
  return (
    <View style={styles.header}>
      <View style={styles.flex}>
        {overline ? (
          <Text variant="overline" tone="accent">
            {overline}
          </Text>
        ) : null}
        <Text variant="display" accessibilityRole="header">
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}

export function SectionTitle({ children, right }: { children: string; right?: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="overline" tone="muted" accessibilityRole="header">
        {children}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
});
