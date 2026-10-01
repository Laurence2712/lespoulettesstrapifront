import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MemoryGrid } from '@/components/experience/MemoryGrid';
import { ExperienceMap } from '@/components/map/ExperienceMap';
import { WORLD_REGION } from '@/components/map/types';
import { Avatar, Button, EmptyState, SectionTitle, Text } from '@/components/ui';
import { regionForExperiences } from '@/features/experiences/cluster';
import { computeStats } from '@/features/experiences/stats';
import { useData, useRelation } from '@/features/experiences/store';
import type { Experience, Profile } from '@/features/experiences/types';
import { useTheme } from '@/theme/ThemeProvider';

function Count({ value, label, onPress }: { value: number; label: string; onPress?: () => void }) {
  return (
    <Pressable
      style={styles.count}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${value} ${label}`}
      onPress={onPress}
    >
      <Text variant="title" align="center">
        {value}
      </Text>
      <Text variant="caption" tone="muted" align="center">
        {label}
      </Text>
    </Pressable>
  );
}

/** Shared layout for "my profile" and "someone else's profile". `experiences` must already be access-filtered. */
export function ProfileView({ profile, experiences, isMe }: { profile: Profile; experiences: Experience[]; isMe: boolean }) {
  const { colors, radius, spacing } = useTheme();
  const stats = useMemo(() => computeStats(experiences), [experiences]);
  const region = useMemo(() => regionForExperiences(experiences) ?? WORLD_REGION, [experiences]);
  const friendCount = useData(
    (s) => s.friendships.filter((f) => f.status === 'accepted' && (f.requesterId === profile.id || f.addresseeId === profile.id)).length,
  );
  const relation = useRelation(profile.id);
  const { sendFriendRequest, acceptFriendRequest, removeFriendship } = useData.getState();

  return (
    <View style={{ gap: spacing.lg }}>
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <Avatar uri={profile.avatarUrl} name={profile.displayName} size={96} ring />
        <Text variant="title" align="center" accessibilityRole="header">
          {profile.displayName}
        </Text>
        <Text tone="accent" variant="caption" style={{ fontWeight: '600' }}>
          @{profile.username}
        </Text>
        {profile.bio ? (
          <Text tone="muted" align="center" style={{ maxWidth: 320 }}>
            {profile.bio}
          </Text>
        ) : null}
      </View>

      <View style={[styles.counts, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg }]}>
        <Count value={stats.total} label="expériences" />
        <Count value={stats.distinctPlaces} label="lieux" />
        <Count value={friendCount} label="amis" onPress={isMe ? () => router.push('/friends') : undefined} />
      </View>

      {isMe ? (
        <View style={styles.actions}>
          <Button label="Modifier le profil" icon="create-outline" variant="secondary" size="sm" onPress={() => router.push('/settings')} style={{ flex: 1 }} />
          <Button label="Amis" icon="people-outline" variant="secondary" size="sm" onPress={() => router.push('/friends')} style={{ flex: 1 }} />
        </View>
      ) : relation.kind === 'none' ? (
        <Button label="Ajouter en ami" icon="person-add-outline" onPress={() => sendFriendRequest(profile.id)} fullWidth />
      ) : relation.kind === 'outgoing' ? (
        <Button label="Demande envoyée · Annuler" icon="time-outline" variant="secondary" onPress={() => removeFriendship(relation.friendshipId)} fullWidth />
      ) : relation.kind === 'incoming' ? (
        <Button label="Accepter la demande" icon="checkmark" onPress={() => acceptFriendRequest(relation.friendshipId)} fullWidth />
      ) : relation.kind === 'friends' ? (
        <View style={[styles.friendBadge, { backgroundColor: colors.accentSoft, borderRadius: radius.pill }]}>
          <Text tone="accent" variant="caption" style={{ fontWeight: '700' }}>
            ✓ Vous êtes amis
          </Text>
        </View>
      ) : null}

      <SectionTitle>{isMe ? 'Ma carte' : 'Sa carte'}</SectionTitle>
      <View style={[styles.map, { borderRadius: radius.lg, borderColor: colors.border }]}>
        <ExperienceMap
          key={`${region.latitude}-${region.longitude}-${experiences.length}`}
          experiences={experiences}
          initialRegion={region}
          interactive={false}
          onSelect={(e) => router.push(`/experience/${e.id}`)}
        />
      </View>

      <SectionTitle>Souvenirs</SectionTitle>
      {experiences.length ? (
        <MemoryGrid experiences={experiences} />
      ) : (
        <EmptyState
          icon="images-outline"
          title={isMe ? 'Aucun souvenir' : 'Rien de visible'}
          message={
            isMe
              ? 'Tes expériences apparaîtront ici, avec leurs photos.'
              : 'Cette personne n’a rien partagé avec toi pour le moment.'
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  counts: { flexDirection: 'row', paddingVertical: 14, borderWidth: StyleSheet.hairlineWidth },
  count: { flex: 1, gap: 2 },
  actions: { flexDirection: 'row', gap: 10 },
  friendBadge: { alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 8 },
  map: { height: 220, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
});
