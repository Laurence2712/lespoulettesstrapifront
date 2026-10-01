import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { ProfileView } from '@/components/ProfileView';
import { EmptyState, ErrorState, LoadingState, Screen } from '@/components/ui';
import { fetchUserPage } from '@/data/remote';
import { useData, useProfileByUsername, useVisibleExperiencesOf } from '@/features/experiences/store';
import { supabase } from '@/lib/supabase';

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const profile = useProfileByUsername(username);
  const meId = useData((s) => s.meId);
  // Access-filtered: private experiences of others are never included.
  const experiences = useVisibleExperiencesOf(profile?.id);
  const [state, setState] = useState<'loading' | 'done' | 'missing' | 'error'>(supabase ? 'loading' : 'done');

  // Supabase mode: always fetch the latest version of this page (strangers aren't in the cache).
  const load = useCallback(() => {
    if (!supabase || !username) return;
    fetchUserPage(supabase, username)
      .then((page) => {
        if (!page) return setState('missing');
        useData.getState().mergeFromServer({ profiles: [page.profile], experiences: page.experiences });
        setState('done');
      })
      .catch(() => setState('error'));
  }, [username]);

  useEffect(load, [load]);

  if (profile && profile.id === meId) return <Redirect href="/(tabs)/profile" />;

  return (
    <Screen edges="none">
      <Stack.Screen options={{ title: profile ? `@${profile.username}` : '' }} />
      {profile ? (
        <ProfileView profile={profile} experiences={experiences} isMe={false} />
      ) : state === 'loading' ? (
        <LoadingState />
      ) : state === 'error' ? (
        <ErrorState
          message="Impossible de charger ce profil. Vérifie ta connexion."
          onRetry={() => {
            setState('loading');
            load();
          }}
        />
      ) : (
        <EmptyState icon="person-outline" title="Profil introuvable" message="Ce profil n’existe pas ou n’est pas public." />
      )}
    </Screen>
  );
}
