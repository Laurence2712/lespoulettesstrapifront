import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { ProfileEditor } from '@/components/ProfileEditor';
import { Button, Screen, Text } from '@/components/ui';
import { useSettings } from '@/features/settings/store';
import { isSupabaseConfigured } from '@/lib/env';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

const SLIDES: { icon: React.ComponentProps<typeof Ionicons>['name']; title: string; text: string }[] = [
  { icon: 'map', title: 'Ta vie, sur une carte', text: 'Chaque lieu, rencontre ou découverte devient un point sur ta carte personnelle.' },
  { icon: 'flash', title: 'En moins de 30 secondes', text: 'Une photo, un titre, un lieu. C’est enregistré.' },
  { icon: 'lock-closed', title: 'Toi seul décides', text: 'Privé, amis ou public : chaque expérience a sa visibilité. Privé par défaut.' },
];

export default function WelcomeScreen() {
  const { colors, radius, spacing } = useTheme();
  const completeOnboarding = useSettings((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const isProfileStep = step === SLIDES.length;

  const finish = () => {
    haptic.success();
    completeOnboarding();
    router.replace('/(tabs)');
  };

  if (isProfileStep) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Screen>
          <Text variant="overline" tone="accent">
            Dernière étape
          </Text>
          <Text variant="display">Présente-toi</Text>
          <Text tone="muted">Ton nom et ton identifiant permettent à tes amis de te trouver. Tu pourras tout modifier plus tard.</Text>
          <ProfileEditor submitLabel="Commencer ma carte" onSaved={finish} />
        </Screen>
      </KeyboardAvoidingView>
    );
  }

  const slide = SLIDES[step]!;
  return (
    <Screen scroll={false}>
      <View style={[styles.flex, { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, justifyContent: 'space-between' }]}>
        <View style={{ alignItems: 'flex-start', gap: spacing.xs, marginTop: spacing.xl }}>
          <Text variant="overline" tone="accent">
            LIFE MAP
          </Text>
          <Text variant="caption" tone="muted">
            Your life. Your journey. Your map.
          </Text>
        </View>

        <View style={{ gap: spacing.lg }}>
          <View style={[styles.halo, { backgroundColor: colors.accentSoft, borderRadius: radius.pill }]}>
            <View style={[styles.core, { backgroundColor: colors.accent, borderRadius: radius.pill }]}>
              <Ionicons name={slide.icon} size={40} color={colors.accentText} />
            </View>
          </View>
          <Text variant="display" accessibilityRole="header">
            {slide.title}
          </Text>
          <Text tone="muted" style={{ fontSize: 18, lineHeight: 26 }}>
            {slide.text}
          </Text>
        </View>

        <View style={{ gap: spacing.lg }}>
          <View style={styles.dots} accessibilityLabel={`Étape ${step + 1} sur ${SLIDES.length}`}>
            {SLIDES.map((s, i) => (
              <View
                key={s.title}
                style={{
                  height: 6,
                  width: i === step ? 24 : 6,
                  borderRadius: 3,
                  backgroundColor: i === step ? colors.accent : colors.textSubtle,
                }}
              />
            ))}
          </View>
          <Button label={step === SLIDES.length - 1 ? 'Créer mon profil' : 'Continuer'} onPress={() => setStep((s) => s + 1)} fullWidth />
          {!isSupabaseConfigured ? (
            <Text variant="caption" tone="subtle" align="center">
              Mode démo : tes données restent sur cet appareil.
            </Text>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  halo: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  core: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 6 },
});
