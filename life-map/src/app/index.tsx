import { Redirect } from 'expo-router';

import { ErrorState, LoadingState } from '@/components/ui';
import { useAuth } from '@/features/auth/authStore';
import { syncFromServer } from '@/features/experiences/store';
import { useSettings } from '@/features/settings/store';
import { supabase } from '@/lib/supabase';

/** Entry point: decides where the user lands. */
export default function Index() {
  const hasOnboardedLocally = useSettings((s) => s.hasOnboarded);
  const session = useAuth((s) => s.session);
  const sync = useAuth((s) => s.sync);
  const syncError = useAuth((s) => s.syncError);
  const myProfile = useAuth((s) => s.myProfile);

  // Demo mode: no accounts.
  if (!supabase) return <Redirect href={hasOnboardedLocally ? '/(tabs)' : '/welcome'} />;

  if (!session) return <Redirect href="/sign-in" />;
  if (!myProfile) {
    if (sync === 'error') {
      return <ErrorState message={`Impossible de charger ta carte. ${syncError ?? ''}`} onRetry={() => void syncFromServer()} />;
    }
    return <LoadingState label="Chargement de ta carte…" />;
  }
  return <Redirect href={myProfile.onboarded ? '/(tabs)' : '/welcome'} />;
}
