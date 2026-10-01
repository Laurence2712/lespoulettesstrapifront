import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { CATEGORIES } from '@/features/experiences/categories';
import type { Experience } from '@/features/experiences/types';
import { useTheme } from '@/theme/ThemeProvider';

/** 3-column gallery of memories. Experiences without photos get a category tile. */
export function MemoryGrid({ experiences }: { experiences: Experience[] }) {
  const { colors, radius } = useTheme();
  return (
    <View style={styles.grid}>
      {experiences.map((e) => {
        const cover = e.media[0]?.uri;
        const meta = CATEGORIES[e.category];
        return (
          <Pressable
            key={e.id}
            accessibilityRole="button"
            accessibilityLabel={e.title}
            onPress={() => router.push(`/experience/${e.id}`)}
            style={({ pressed }) => [styles.cell, { opacity: pressed ? 0.85 : 1 }]}
          >
            <View style={[styles.inner, { borderRadius: radius.md, backgroundColor: `${meta.color}22` }]}>
              {cover ? (
                <Image source={{ uri: cover }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
              ) : (
                <View style={styles.placeholder}>
                  <Ionicons name={meta.icon} size={22} color={meta.color} />
                  <Text variant="caption" numberOfLines={2} align="center" style={{ color: colors.text, fontSize: 11 }}>
                    {e.title}
                  </Text>
                </View>
              )}
              {e.visibility === 'private' ? (
                <View style={[styles.lock, { backgroundColor: colors.overlay }]}>
                  <Ionicons name="lock-closed" size={10} color="#fff" />
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3 },
  cell: { width: '33.333%', padding: 3 },
  inner: { aspectRatio: 1, overflow: 'hidden' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, padding: 6 },
  lock: { position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
