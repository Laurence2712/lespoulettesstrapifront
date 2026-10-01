import { router, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastHost } from '@/components/ui';
import { useAuth } from '@/features/auth/authStore';
import { startAuth } from '@/features/auth/session';
import { syncFromServer } from '@/features/experiences/store';
import { useHydrated } from '@/lib/useHydrated';
import { supabase } from '@/lib/supabase';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});
startAuth();

function RootStack() {
  const { colors, scheme } = useTheme();
  const storesHydrated = useHydrated();
  const authReady = useAuth((s) => s.initialized);
  const hasSession = useAuth((s) => !!s.session);
  const segments = useSegments();
  const hydrated = storesHydrated && authReady;

  // Signed out (or session expired) anywhere outside the auth screens → back to sign-in.
  const inAuthFlow = segments[0] === '(auth)';
  useEffect(() => {
    if (supabase && authReady && !hasSession && !inAuthFlow) router.replace('/sign-in');
  }, [authReady, hasSession, inAuthFlow]);

  // Refresh data (and photo links) whenever the app comes back to the foreground.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void syncFromServer();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync().catch(() => {});
  }, [hydrated]);

  // Keep the native splash (Midnight background) until local data is loaded.
  if (!hydrated) return null;

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="welcome" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="experience/[id]" options={{ title: '' }} />
        <Stack.Screen name="experience/edit/[id]" options={{ title: 'Modifier', presentation: 'modal' }} />
        <Stack.Screen name="user/[username]" options={{ title: '' }} />
        <Stack.Screen name="search" options={{ title: 'Rechercher' }} />
        <Stack.Screen name="friends" options={{ title: 'Amis' }} />
        <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
        <Stack.Screen name="settings" options={{ title: 'Paramètres' }} />
        <Stack.Screen name="privacy" options={{ title: 'Confidentialité' }} />
      </Stack>
      <ToastHost />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
