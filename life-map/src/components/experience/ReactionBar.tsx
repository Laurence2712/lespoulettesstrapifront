import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useData } from '@/features/experiences/store';
import { REACTION_KINDS, type ReactionKind } from '@/features/experiences/types';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

type IconName = ComponentProps<typeof Ionicons>['name'];

export const REACTION_META: Record<ReactionKind, { label: string; icon: IconName; iconActive: IconName }> = {
  love: { label: 'J’adore', icon: 'heart-outline', iconActive: 'heart' },
  wow: { label: 'Waouh', icon: 'flash-outline', iconActive: 'flash' },
  inspired: { label: 'Inspirant', icon: 'bulb-outline', iconActive: 'bulb' },
};

export function ReactionBar({ experienceId, commentCount, onComment }: { experienceId: string; commentCount: number; onComment?: () => void }) {
  const { colors, radius } = useTheme();
  const meId = useData((s) => s.meId);
  const reactions = useData((s) => s.reactions);
  const toggle = useData((s) => s.toggleReaction);
  const forThis = reactions.filter((r) => r.experienceId === experienceId);
  const mine = forThis.find((r) => r.userId === meId)?.kind;

  return (
    <View style={styles.row}>
      {REACTION_KINDS.map((kind) => {
        const meta = REACTION_META[kind];
        const active = mine === kind;
        const count = forThis.filter((r) => r.kind === kind).length;
        return (
          <Pressable
            key={kind}
            accessibilityRole="button"
            accessibilityLabel={`${meta.label}${count ? `, ${count}` : ''}`}
            accessibilityState={{ selected: active }}
            onPress={() => {
              haptic.tap();
              toggle(experienceId, kind);
            }}
            hitSlop={6}
            style={[styles.pill, { borderRadius: radius.pill, backgroundColor: active ? colors.accentSoft : 'transparent' }]}
          >
            <Ionicons name={active ? meta.iconActive : meta.icon} size={19} color={active ? colors.accent : colors.textMuted} />
            {count > 0 ? (
              <Text variant="caption" style={{ color: active ? colors.accent : colors.textMuted, fontWeight: '600' }}>
                {count}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
      <View style={{ flex: 1 }} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Commentaires, ${commentCount}`}
        onPress={onComment}
        hitSlop={6}
        style={[styles.pill, { borderRadius: radius.pill }]}
      >
        <Ionicons name="chatbubble-outline" size={18} color={colors.textMuted} />
        <Text variant="caption" tone="muted" style={{ fontWeight: '600' }}>
          {commentCount}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, minHeight: 36 },
});
