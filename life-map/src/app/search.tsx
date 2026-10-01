import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { PersonRow } from '@/components/PersonRow';
import { Button, EmptyState, ErrorState, Field, Screen, SectionTitle } from '@/components/ui';
import { searchProfiles } from '@/data/remote';
import { useData, type FriendRelation } from '@/features/experiences/store';
import type { Friendship, Profile } from '@/features/experiences/types';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme/ThemeProvider';

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

  const { colors } = useTheme();
  const [remoteResults, setRemoteResults] = useState<Profile[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supabase mode: search on the server (debounced). Demo mode: search local profiles.
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let cancelled = false;
    const t = setTimeout(() => {
      setLoading(true);
      setError(null);
      searchProfiles(client, query)
        .then((found) => {
          if (cancelled) return;
          useData.getState().mergeFromServer({ profiles: found });
          setRemoteResults(found);
        })
        .catch(() => !cancelled && setError('Recherche impossible. Vérifie ta connexion.'))
        .finally(() => !cancelled && setLoading(false));
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  const results: Profile[] = useMemo(() => {
    if (supabase) return (remoteResults ?? []).filter((p) => p.id !== meId);
    const q = normalize(query.trim().replace(/^@/, ''));
    const discoverable = profiles.filter((p) => p.id !== meId && p.isPublic);
    if (!q) return discoverable;
    return discoverable.filter((p) => normalize(p.displayName).includes(q) || normalize(p.username).includes(q));
  }, [meId, profiles, query, remoteResults]);

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
      <SectionTitle right={loading ? <ActivityIndicator color={colors.accent} /> : undefined}>
        {query ? 'Résultats' : 'Suggestions'}
      </SectionTitle>
      {error ? (
        <ErrorState message={error} />
      ) : results.length === 0 && !loading ? (
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
