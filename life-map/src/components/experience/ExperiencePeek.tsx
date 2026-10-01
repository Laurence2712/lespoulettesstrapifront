import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { CategoryBadge, Text } from '@/components/ui';
import { VISIBILITY_META } from '@/features/experiences/categories';
import { useProfile } from '@/features/experiences/store';
import type { Experience } from '@/features/experiences/types';
import { formatDate } from '@/lib/format';
import { useTheme } from '@/theme/ThemeProvider';

/** Compact card shown above the tab bar when a map pin is selected. */
export function ExperiencePeek({ experience, onClose }: { experience: Experience; onClose: () => void }) {
  const { colors, radius, spacing } = useTheme();
  const owner = useProfile(experience.ownerId);
  const cover = experience.media[0]?.uri;
  const vis = VISIBILITY_META[experience.visibility];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ouvrir ${experience.title}`}
      onPress={() => router.push(`/experience/${experience.id}`)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.sm,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {cover ? (
        <Image source={{ uri: cover }} style={[styles.cover, { borderRadius: radius.md }]} contentFit="cover" transition={200} />
      ) : (
        <View style={[styles.cover, styles.noCover, { borderRadius: radius.md, backgroundColor: colors.accentSoft }]}>
          <Ionicons name="image-outline" size={24} color={colors.accent} />
        </View>
      )}
      <View style={{ flex: 1, gap: 4, paddingVertical: 2 }}>
        <View style={styles.row}>
          <CategoryBadge category={experience.category} />
          <Ionicons name={vis.icon} size={13} color={colors.textSubtle} accessibilityLabel={vis.label} />
        </View>
        <Text variant="bodyStrong" numberOfLines={1}>
          {experience.title}
        </Text>
        <Text variant="caption" tone="muted" numberOfLines={1}>
          {experience.placeName} · {formatDate(experience.date, { short: true })}
        </Text>
        {owner ? (
          <Text variant="caption" tone="subtle" numberOfLines={1}>
            par {owner.displayName}
          </Text>
        ) : null}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Fermer" onPress={onClose} hitSlop={10} style={styles.close}>
        <Ionicons name="close" size={18} color={colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cover: { width: 92, height: 92 },
  noCover: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  close: { padding: 4, alignSelf: 'flex-start' },
});
