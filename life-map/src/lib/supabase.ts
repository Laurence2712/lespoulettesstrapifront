import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import type { Database } from './database.types';
import { env, isSupabaseConfigured } from './env';

export type LifeMapClient = SupabaseClient<Database>;

/**
 * Single Supabase client, or null in demo mode (no keys configured).
 * Uses only the public anon key: every permission is enforced by RLS in the database.
 */
export const supabase: LifeMapClient | null = isSupabaseConfigured
  ? createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        // The session (JWT + refresh token) is kept in app storage so users stay signed in.
        storage: Platform.OS === 'web' ? undefined : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

/** Throws a clear error when a backend call is attempted in demo mode. */
export function requireSupabase(): LifeMapClient {
  if (!supabase) throw new Error('Supabase n’est pas configuré (mode démo).');
  return supabase;
}

// Refresh tokens only while the app is in the foreground (recommended for React Native).
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

export const MEDIA_BUCKET = 'experience-media';
export const AVATAR_BUCKET = 'avatars';
