import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ProfileEditor } from '@/components/ProfileEditor';
import { Card, Chip, Screen, SectionTitle, Text, toast } from '@/components/ui';
import { signOut } from '@/features/auth/session';
import { useAuth } from '@/features/auth/authStore';
import { useData } from '@/features/experiences/store';
import { useSettings, type ThemePreference } from '@/features/settings/store';
import { isSupabaseConfigured } from '@/lib/env';
import { useTheme } from '@/theme/ThemeProvider';

const THEMES: { id: ThemePreference; label: string }[] = [
  { id: 'dark', label: 'Sombre' },
  { id: 'light', label: 'Clair' },
  { id: 'system', label: 'Système' },
];

function Row({ icon, label, onPress, danger }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; onPress: () => void; danger?: boolean }) {
  const { colors, spacing } = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, { paddingVertical: spacing.md, opacity: pressed ? 0.7 : 1 }]}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.textMuted} />
      <Text style={{ flex: 1 }} tone={danger ? 'danger' : 'default'}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { spacing } = useTheme();
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);
  const resetOnboarding = useSettings((s) => s.resetOnboarding);
  const resetDemo = useData((s) => s.resetDemo);
  const email = useAuth((s) => s.session?.user.email);

  return (
    <Screen edges="none">
      <SectionTitle>Profil</SectionTitle>
      <Card>
        <ProfileEditor submitLabel="Enregistrer le profil" onSaved={() => toast('Profil mis à jour.', 'success')} />
      </Card>

      <SectionTitle>Apparence</SectionTitle>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {THEMES.map((t) => (
          <Chip key={t.id} label={t.label} selected={theme === t.id} onPress={() => setTheme(t.id)} />
        ))}
      </View>

      <SectionTitle>Compte</SectionTitle>
      <Card padded={false} style={{ paddingHorizontal: spacing.lg }}>
        <Row icon="shield-checkmark-outline" label="Confidentialité et données" onPress={() => router.push('/privacy')} />
        <Row icon="people-outline" label="Amis" onPress={() => router.push('/friends')} />
        <Row icon="notifications-outline" label="Notifications" onPress={() => router.push('/notifications')} />
        <Row
          icon="refresh-outline"
          label="Revoir l’accueil"
          onPress={() => {
            resetOnboarding();
            router.replace('/welcome');
          }}
        />
        {isSupabaseConfigured ? (
          <Row
            icon="log-out-outline"
            label={email ? `Se déconnecter (${email})` : 'Se déconnecter'}
            onPress={() =>
              Alert.alert('Se déconnecter ?', 'Tes données restent en sécurité sur ton compte.', [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Se déconnecter', style: 'destructive', onPress: () => void signOut() },
              ])
            }
          />
        ) : null}
      </Card>

      {!isSupabaseConfigured ? (
        <>
          <SectionTitle>Mode démo</SectionTitle>
          <Card style={{ gap: spacing.sm }}>
            <Text tone="muted">
              Les données sont stockées uniquement sur cet appareil. La connexion par e-mail et la synchronisation arrivent avec la configuration Supabase.
            </Text>
            <Row
              icon="sparkles-outline"
              label="Réinitialiser les données de démo"
              onPress={() =>
                Alert.alert('Réinitialiser la démo ?', 'Tes expériences ajoutées seront remplacées par le jeu de démonstration.', [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Réinitialiser', style: 'destructive', onPress: () => { resetDemo(); toast('Démo réinitialisée.'); } },
                ])
              }
            />
          </Card>
        </>
      ) : null}

      <Text tone="subtle" variant="caption" align="center">
        LIFE MAP {Constants.expoConfig?.version ?? ''} · Your life. Your journey. Your map.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
});
