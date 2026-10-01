import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeedPost } from '@/components/experience/FeedPost';
import { Button, EmptyState, IconButton, ScreenHeader, Skeleton, TAB_BAR_SPACE, Text } from '@/components/ui';
import { syncFromServer, useData, useFeed } from '@/features/experiences/store';
import { useTheme } from '@/theme/ThemeProvider';

const PAGE_SIZE = 5;

export default function FeedScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const feed = useFeed();
  const pendingRequests = useData((s) => s.friendships.filter((f) => f.addresseeId === s.meId && f.status === 'pending').length);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [refreshing, setRefreshing] = useState(false);

  const page = feed.slice(0, limit);
  const hasMore = limit < feed.length;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLimit(PAGE_SIZE);
    // Supabase: refetch from the server. Demo: data is local, nothing to fetch.
    syncFromServer().finally(() => setRefreshing(false));
  }, []);

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.sm,
        paddingBottom: TAB_BAR_SPACE + insets.bottom,
        paddingHorizontal: spacing.lg,
        gap: spacing.lg,
        flexGrow: 1,
      }}
      data={page}
      keyExtractor={(e) => e.id}
      renderItem={({ item }) => <FeedPost experience={item} />}
      onEndReachedThreshold={0.6}
      onEndReached={() => hasMore && setLimit((l) => l + PAGE_SIZE)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      ListHeaderComponent={
        <View style={{ gap: spacing.md }}>
          <ScreenHeader
            overline="Tes amis"
            title="Feed"
            right={
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <IconButton icon="search" label="Rechercher des personnes" onPress={() => router.push('/search')} />
                <IconButton icon="people-outline" label="Amis" onPress={() => router.push('/friends')} badge={pendingRequests > 0} />
              </View>
            }
          />
          {pendingRequests > 0 ? (
            <Button
              label={`${pendingRequests} demande${pendingRequests > 1 ? 's' : ''} d’amitié`}
              icon="person-add-outline"
              variant="secondary"
              size="sm"
              onPress={() => router.push('/friends')}
            />
          ) : null}
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          icon="people-outline"
          title="Ton feed est calme"
          message="Quand tes amis partagent une expérience avec toi, elle apparaît ici. Les expériences privées ne sont jamais affichées."
          actionLabel="Trouver des amis"
          onAction={() => router.push('/search')}
        />
      }
      ListFooterComponent={
        hasMore ? (
          <View style={{ gap: spacing.sm }}>
            <Skeleton height={220} radius={20} />
          </View>
        ) : feed.length > 0 ? (
          <Text tone="subtle" align="center" variant="caption">
            Tu es à jour ✦
          </Text>
        ) : null
      }
    />
  );
}
