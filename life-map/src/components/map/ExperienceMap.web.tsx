import { forwardRef, useImperativeHandle } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CategoryBadge, Text } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';

import type { ExperienceMapHandle, ExperienceMapProps } from './types';

/**
 * Web preview fallback: react-native-maps has no web implementation.
 * LIFE MAP targets iOS/Android; on web we list the places instead of drawing a map.
 */
export const ExperienceMap = forwardRef<ExperienceMapHandle, ExperienceMapProps>(function ExperienceMap(
  { experiences, onSelect, padding },
  ref,
) {
  const { colors, spacing } = useTheme();
  useImperativeHandle(ref, () => ({ focus: () => {} }));
  const located = experiences.filter((e) => e.coordinates);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: (padding?.top ?? 0) + spacing.lg,
          paddingBottom: (padding?.bottom ?? 0) + spacing.lg,
          paddingHorizontal: spacing.lg,
          gap: spacing.sm,
        }}
      >
        <Text tone="muted" variant="caption">
          Aperçu web : la carte interactive est disponible sur iOS et Android.
        </Text>
        {located.map((e) => (
          <Card key={e.id} onPress={() => onSelect(e)} accessibilityLabel={e.title}>
            <CategoryBadge category={e.category} />
            <Text variant="bodyStrong" style={{ marginTop: 6 }}>
              {e.title}
            </Text>
            <Text tone="muted" variant="caption">
              {e.placeName} · {e.coordinates!.latitude.toFixed(3)}, {e.coordinates!.longitude.toFixed(3)}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
});
