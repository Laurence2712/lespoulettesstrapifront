import { syncFromServer, useData } from '@/features/experiences/store';
import { supabase } from '@/lib/supabase';

import { useAuth } from './authStore';

let started = false;

/** Starts listening to auth changes. Called once from the root layout. */
export function startAuth() {
  if (!supabase || started) return;
  started = true;
  supabase.auth.onAuthStateChange((event, session) => {
    const previous = useAuth.getState().session?.user.id;
    useAuth.setState({ session, initialized: true });
    if (!session) {
      // Signed out: wipe everything from the device.
      useAuth.setState({ myProfile: null, sync: 'idle', syncError: null });
      useData.getState().clearLocal();
      return;
    }
    if (previous !== session.user.id) {
      useAuth.setState({ sync: 'idle', myProfile: null });
      useData.getState().clearLocal();
    }
    if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || previous !== session.user.id) {
      // Deferred: Supabase advises against awaiting other calls inside this callback.
      setTimeout(() => void syncFromServer(), 0);
    }
  });
}

export async function signOut() {
  await supabase?.auth.signOut();
}
