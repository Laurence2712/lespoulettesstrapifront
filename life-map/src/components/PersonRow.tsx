import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Text } from '@/components/ui';
import type { Profile } from '@/features/experiences/types';
import { useTheme } from '@/theme/ThemeProvider';

export function PersonRow({ profile, subtitle, right }: { profile: Profile; subtitle?: string; right?: ReactNode }) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.row, { paddingVertical: spacing.sm }]}>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Profil de ${profile.displayName}`}
        onPress={() => router.push(`/user/${profile.username}`)}
        style={[styles.row, { flex: 1 }]}
      >
        <Avatar uri={profile.avatarUrl} name={profile.displayName} size={46} />
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong" numberOfLines={1}>
            {profile.displayName}
          </Text>
          <Text variant="caption" tone="subtle" numberOfLines={1}>
            {subtitle ?? `@${profile.username}`}
          </Text>
        </View>
      </Pressable>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
