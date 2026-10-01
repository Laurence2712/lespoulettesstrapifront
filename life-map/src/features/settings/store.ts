import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Visibility } from '@/features/experiences/types';

export type ThemePreference = 'system' | 'dark' | 'light';

type SettingsState = {
  theme: ThemePreference;
  defaultVisibility: Visibility;
  hasOnboarded: boolean;
  setTheme: (theme: ThemePreference) => void;
  setDefaultVisibility: (visibility: Visibility) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      // Dark by default, per brand direction.
      theme: 'dark',
      // Private by default: nothing is shared unless the user decides to.
      defaultVisibility: 'private',
      hasOnboarded: false,
      setTheme: (theme) => set({ theme }),
      setDefaultVisibility: (defaultVisibility) => set({ defaultVisibility }),
      completeOnboarding: () => set({ hasOnboarded: true }),
      resetOnboarding: () => set({ hasOnboarded: false }),
    }),
    {
      name: 'lifemap.settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ theme, defaultVisibility, hasOnboarded }) => ({ theme, defaultVisibility, hasOnboarded }),
    },
  ),
);
