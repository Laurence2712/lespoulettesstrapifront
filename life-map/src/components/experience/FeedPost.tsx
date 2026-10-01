import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Card, CategoryBadge, Text } from '@/components/ui';
import { useData, useProfile } from '@/features/experiences/store';
import type { Experience } from '@/features/experiences/types';
import { formatDate } from '@/lib/format';
import { useTheme } from '@/theme/ThemeProvider';

import { ReactionBar } from './ReactionBar';

export const FeedPost = memo(function FeedPost({ experience }: { experience: Experience }) {
  const { colors, spacing, radius } = useTheme();
  const author = useProfile(experience.ownerId);
  const commentCount = useData((s) => s.comments.filter((c) => c.experienceId === experience.id).length);
  const cover = experience.media[0]?.uri;
  const open = () => router.push(`/experience/${experience.id}`);

  return (
    <Card padded={false}>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Profil de ${author?.displayName ?? 'utilisateur'}`}
        onPress={() => author && router.push(`/user/${author.username}`)}
        style={[styles.header, { padding: spacing.md }]}
      >
        <Avatar uri={author?.avatarUrl} name={author?.displayName ?? '?'} size={38} />
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong">{author?.displayName}</Text>
          <View style={styles.meta}>
            <Ionicons name="location-outline" size={12} color={colors.textSubtle} />
            <Text variant="caption" tone="subtle" numberOfLines={1} style={{ flexShrink: 1 }}>
              {experience.placeName} · {formatDate(experience.date, { short: true })}
            </Text>
          </View>
        </View>
        <CategoryBadge category={experience.category} />
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel={`Ouvrir ${experience.title}`} onPress={open}>
        {cover ? (
          <View>
            <Image source={{ uri: cover }} style={styles.cover} contentFit="cover" transition={250} />
            {experience.media.length > 1 ? (
              <View style={[styles.count, { backgroundColor: colors.overlay, borderRadius: radius.pill }]}>
                <Ionicons name="images-outline" size={12} color="#fff" />
                <Text variant="caption" style={{ color: '#fff', fontWeight: '600' }}>
                  {experience.media.length}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: 4 }}>
          <Text variant="title" style={{ fontSize: 21, lineHeight: 26 }}>
            {experience.title}
          </Text>
          {experience.description ? (
            <Text tone="muted" numberOfLines={3}>
              {experience.description}
            </Text>
          ) : null}
        </View>
      </Pressable>

      <View style={{ paddingHorizontal: spacing.sm, paddingVertical: spacing.sm }}>
        <ReactionBar experienceId={experience.id} commentCount={commentCount} onComment={open} />
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cover: { width: '100%', aspectRatio: 4 / 3 },
  count: { position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3 },
});
