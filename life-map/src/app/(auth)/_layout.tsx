import { Redirect, Stack } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme/ThemeProvider';

export default function AuthLayout() {
  const { colors } = useTheme();
  // Accounts only exist when Supabase is configured; demo mode skips these screens.
  if (!supabase) return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
