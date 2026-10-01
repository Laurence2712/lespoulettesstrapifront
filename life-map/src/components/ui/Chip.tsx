import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CATEGORIES } from '@/features/experiences/categories';
import type { CategoryId } from '@/features/experiences/types';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

import { Text } from './Text';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function Chip({
  label,
  selected,
  onPress,
  icon,
  dotColor,
  testID,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  dotColor?: string;
  testID?: string;
}) {
  const { colors, radius, spacing } = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
      onPress={() => {
        haptic.tap();
        onPress?.();
      }}
      hitSlop={4}
      style={({ pressed }) => [
        styles.chip,
        {
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md + 2,
          backgroundColor: selected ? colors.accent : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      {icon ? <Ionicons name={icon} size={15} color={selected ? colors.accentText : colors.textMuted} /> : null}
      <Text variant="caption" style={{ color: selected ? colors.accentText : colors.text, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Small, non-interactive category label. */
export function CategoryBadge({ category, compact }: { category: CategoryId; compact?: boolean }) {
  const { radius } = useTheme();
  const meta = CATEGORIES[category];
  return (
    <View
      accessibilityLabel={`Catégorie ${meta.label}`}
      style={[styles.badge, { borderRadius: radius.pill, backgroundColor: `${meta.color}26` }]}
    >
      <Ionicons name={meta.icon} size={12} color={meta.color} />
      {compact ? null : (
        <Text variant="caption" style={{ color: meta.color, fontWeight: '600', fontSize: 12 }}>
          {meta.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 38, borderWidth: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
});
