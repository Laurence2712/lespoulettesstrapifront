import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import { PersonRow } from '@/components/PersonRow';
import { Button, EmptyState, IconButton, Screen, SectionTitle } from '@/components/ui';
import { useData } from '@/features/experiences/store';
import { timeAgo } from '@/lib/format';

export default function FriendsScreen() {
  const meId = useData((s) => s.meId);
  const profiles = useData((s) => s.profiles);
  const friendships = useData((s) => s.friendships);
  const { acceptFriendRequest, removeFriendship } = useData.getState();
  const profileOf = (id: string) => profiles.find((p) => p.id === id);

  const incoming = friendships.filter((f) => f.status === 'pending' && f.addresseeId === meId);
  const outgoing = friendships.filter((f) => f.status === 'pending' && f.requesterId === meId);
  const friends = friendships.filter((f) => f.status === 'accepted' && (f.requesterId === meId || f.addresseeId === meId));

  const confirmRemove = (friendshipId: string, name: string) =>
    Alert.alert(`Retirer ${name} de tes amis ?`, 'Cette personne ne verra plus tes expériences « Amis ».', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Retirer', style: 'destructive', onPress: () => removeFriendship(friendshipId) },
    ]);

  return (
    <Screen edges="none">
      <Button label="Trouver des personnes" icon="search" variant="secondary" onPress={() => router.push('/search')} fullWidth />

      {incoming.length ? (
        <View>
          <SectionTitle>{`Demandes reçues · ${incoming.length}`}</SectionTitle>
          {incoming.map((f) => {
            const p = profileOf(f.requesterId);
            if (!p) return null;
            return (
              <PersonRow
                key={f.id}
                profile={p}
                subtitle={`Demande ${timeAgo(f.createdAt)}`}
                right={
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <Button label="Accepter" size="sm" onPress={() => acceptFriendRequest(f.id)} />
                    <IconButton icon="close" label="Refuser" size={40} onPress={() => removeFriendship(f.id)} />
                  </View>
                }
              />
            );
          })}
        </View>
      ) : null}

      {outgoing.length ? (
        <View>
          <SectionTitle>Demandes envoyées</SectionTitle>
          {outgoing.map((f) => {
            const p = profileOf(f.addresseeId);
            if (!p) return null;
            return <PersonRow key={f.id} profile={p} right={<Button label="Annuler" size="sm" variant="ghost" onPress={() => removeFriendship(f.id)} />} />;
          })}
        </View>
      ) : null}

      <View>
        <SectionTitle>{`Amis · ${friends.length}`}</SectionTitle>
        {friends.length === 0 ? (
          <EmptyState icon="people-outline" title="Pas encore d’amis" message="Invite tes proches pour partager vos cartes." />
        ) : (
          friends.map((f) => {
            const p = profileOf(f.requesterId === meId ? f.addresseeId : f.requesterId);
            if (!p) return null;
            return (
              <PersonRow
                key={f.id}
                profile={p}
                right={<IconButton icon="person-remove-outline" label={`Retirer ${p.displayName}`} size={40} onPress={() => confirmRemove(f.id, p.displayName)} />}
              />
            );
          })
        )}
      </View>
    </Screen>
  );
}
