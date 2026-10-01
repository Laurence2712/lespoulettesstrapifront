import { Redirect } from 'expo-router';

import { useSettings } from '@/features/settings/store';

export default function Index() {
  const hasOnboarded = useSettings((s) => s.hasOnboarded);
  return <Redirect href={hasOnboarded ? '/(tabs)' : '/welcome'} />;
}
