import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { ProfileView } from '@/components/ProfileView';
import { EmptyState, Screen } from '@/components/ui';
import { useData, useProfileByUsername, useVisibleExperiencesOf } from '@/features/experiences/store';

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const profile = useProfileByUsername(username);
  const meId = useData((s) => s.meId);
  // Access-filtered: private experiences of others are never included.
  const experiences = useVisibleExperiencesOf(profile?.id);

  if (profile?.id === meId) return <Redirect href="/(tabs)/profile" />;

  return (
    <Screen edges="none">
      <Stack.Screen options={{ title: profile ? `@${profile.username}` : '' }} />
      {profile ? (
        <ProfileView profile={profile} experiences={experiences} isMe={false} />
      ) : (
        <EmptyState icon="person-outline" title="Profil introuvable" message="Ce profil n’existe pas ou n’est pas public." />
      )}
    </Screen>
  );
}
