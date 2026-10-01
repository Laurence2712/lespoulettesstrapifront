/**
 * Public client configuration. Only EXPO_PUBLIC_* variables are inlined into the app bundle,
 * so nothing secret may ever be read here.
 */
export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
};

/** Without Supabase keys the app runs in demo mode (local, on-device data). */
export const isSupabaseConfigured = env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;
