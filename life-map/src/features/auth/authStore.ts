import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import type { ProfileRow } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type SyncStatus = 'idle' | 'syncing' | 'ready' | 'error';

type AuthState = {
  /** True once the stored session (if any) has been read. Always true in demo mode. */
  initialized: boolean;
  session: Session | null;
  myProfile: ProfileRow | null;
  sync: SyncStatus;
  syncError: string | null;
};

export const useAuth = create<AuthState>(() => ({
  initialized: supabase === null,
  session: null,
  myProfile: null,
  sync: 'idle',
  syncError: null,
}));

/** Remote mode = Supabase configured AND a user signed in. */
export function remoteUserId(): string | null {
  return supabase ? (useAuth.getState().session?.user.id ?? null) : null;
}
