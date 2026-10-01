import { useMemo, useState } from 'react';

import { PersonRow } from '@/components/PersonRow';
import { Button, EmptyState, Field, Screen, SectionTitle } from '@/components/ui';
import { useData, type FriendRelation } from '@/features/experiences/store';
import type { Friendship, Profile } from '@/features/experiences/types';

function relationOf(meId: string, userId: string, friendships: Friendship[]): FriendRelation {
  const f = friendships.find(
    (x) => (x.requesterId === meId && x.addresseeId === userId) || (x.requesterId === userId && x.addresseeId === meId),
  );
  if (!f) return { kind: 'none' };
  if (f.status === 'accepted') return { kind: 'friends', friendshipId: f.id };
  return f.requesterId === meId ? { kind: 'outgoing', friendshipId: f.id } : { kind: 'incoming', friendshipId: f.id };
}

function normalize(s: string) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const meId = useData((s) => s.meId);
  const profiles = useData((s) => s.profiles);
  const friendships = useData((s) => s.friendships);
  const { sendFriendRequest, acceptFriendRequest } = useData.getState();

  const results: Profile[] = useMemo(() => {
    const q = normalize(query.trim().replace(/^@/, ''));
    const discoverable = profiles.filter((p) => p.id !== meId && p.isPublic);
    if (!q) return discoverable;
    return discoverable.filter((p) => normalize(p.displayName).includes(q) || normalize(p.username).includes(q));
  }, [meId, profiles, query]);

  return (
    <Screen edges="none">
      <Field
        label="Nom ou identifiant"
        placeholder="ex. yao.k"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        autoFocus
      />
      <SectionTitle>{query ? 'Résultats' : 'Suggestions'}</SectionTitle>
      {results.length === 0 ? (
        <EmptyState icon="search-outline" title="Aucun résultat" message="Vérifie l’orthographe ou essaie avec l’identifiant (@…)." />
      ) : (
        results.map((p) => {
          const rel = relationOf(meId, p.id, friendships);
          return (
            <PersonRow
              key={p.id}
              profile={p}
              right={
                rel.kind === 'none' ? (
                  <Button label="Ajouter" size="sm" icon="person-add-outline" onPress={() => sendFriendRequest(p.id)} />
                ) : rel.kind === 'incoming' ? (
                  <Button label="Accepter" size="sm" onPress={() => acceptFriendRequest(rel.friendshipId)} />
                ) : rel.kind === 'outgoing' ? (
                  <Button label="Envoyée" size="sm" variant="secondary" disabled />
                ) : (
                  <Button label="Ami·e" size="sm" variant="ghost" icon="checkmark" disabled />
                )
              }
            />
          );
        })
      )}
    </Screen>
  );
}
