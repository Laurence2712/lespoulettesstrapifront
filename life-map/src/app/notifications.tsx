import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, EmptyState, Screen, Text } from '@/components/ui';
import { useData } from '@/features/experiences/store';
import type { AppNotification } from '@/features/experiences/types';
import { timeAgo } from '@/lib/format';
import { useTheme } from '@/theme/ThemeProvider';

const COPY: Record<AppNotification['type'], { text: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  friend_request: { text: 't’a envoyé une demande d’amitié', icon: 'person-add' },
  friend_accepted: { text: 'a accepté ta demande d’amitié', icon: 'people' },
  reaction: { text: 'a réagi à ton expérience', icon: 'heart' },
  comment: { text: 'a commenté ton expérience', icon: 'chatbubble' },
};

export default function NotificationsScreen() {
  const { colors, radius, spacing } = useTheme();
  const meId = useData((s) => s.meId);
  const all = useData((s) => s.notifications);
  const profiles = useData((s) => s.profiles);
  const markRead = useData((s) => s.markNotificationsRead);
  const items = useMemo(
    () => all.filter((n) => n.recipientId === meId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [all, meId],
  );

  // Mark as read when leaving the screen, so unread items stay highlighted while viewing.
  useFocusEffect(useCallback(() => () => markRead(), [markRead]));

  if (items.length === 0) {
    return (
      <Screen edges="none">
        <EmptyState icon="notifications-outline" title="Rien de neuf" message="Les demandes d’amitié, réactions et commentaires apparaîtront ici." />
      </Screen>
    );
  }

  return (
    <Screen edges="none" contentContainerStyle={{ gap: spacing.sm }}>
      {items.map((n) => {
        const actor = profiles.find((p) => p.id === n.actorId);
        const copy = COPY[n.type];
        return (
          <Pressable
            key={n.id}
            accessibilityRole="button"
            onPress={() => {
              if (n.type === 'friend_request' || n.type === 'friend_accepted') router.push('/friends');
              else if (n.experienceId) router.push(`/experience/${n.experienceId}`);
            }}
            style={({ pressed }) => [
              styles.row,
              {
                padding: spacing.md,
                borderRadius: radius.md,
                backgroundColor: n.read ? 'transparent' : colors.accentSoft,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View>
              <Avatar uri={actor?.avatarUrl} name={actor?.displayName ?? '?'} size={44} />
              <View style={[styles.icon, { backgroundColor: colors.accent, borderColor: colors.background }]}>
                <Ionicons name={copy.icon} size={10} color={colors.accentText} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text>
                <Text variant="bodyStrong">{actor?.displayName ?? 'Quelqu’un'}</Text> {copy.text}
              </Text>
              <Text variant="caption" tone="subtle">
                {timeAgo(n.createdAt)}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { position: 'absolute', right: -2, bottom: -2, width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
