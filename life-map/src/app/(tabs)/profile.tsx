import { router } from 'expo-router';

import { ProfileView } from '@/components/ProfileView';
import { IconButton, Screen, ScreenHeader } from '@/components/ui';
import { useMe, useMyExperiences } from '@/features/experiences/store';

export default function ProfileScreen() {
  const me = useMe();
  const mine = useMyExperiences();
  return (
    <Screen withTabBar>
      <ScreenHeader
        overline="Ton journal"
        title="Profil"
        right={<IconButton icon="settings-outline" label="Paramètres" onPress={() => router.push('/settings')} />}
      />
      <ProfileView profile={me} experiences={mine} isMe />
    </Screen>
  );
}
