import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Screen, SectionTitle, Text, toast } from '@/components/ui';
import { VISIBILITY_META } from '@/features/experiences/categories';
import { useData, useMyExperiences } from '@/features/experiences/store';
import { VISIBILITIES } from '@/features/experiences/types';
import { useSettings } from '@/features/settings/store';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

const PROMISES: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string }[] = [
  { icon: 'lock-closed-outline', text: 'Tes nouvelles expériences sont privées par défaut.' },
  { icon: 'navigate-outline', text: 'Ta position est demandée uniquement quand tu touches « Ma position ». Jamais de suivi en arrière-plan.' },
  { icon: 'home-outline', text: 'Le lieu proposé automatiquement s’arrête au quartier et à la ville : jamais de numéro de rue.' },
  { icon: 'eye-off-outline', text: 'Une expérience privée n’apparaît jamais dans le feed, la recherche ou le profil vu par les autres.' },
  { icon: 'image-outline', text: 'Les métadonnées de localisation (EXIF) des photos ne sont pas lues.' },
];

export default function PrivacyScreen() {
  const { colors, radius, spacing } = useTheme();
  const defaultVisibility = useSettings((s) => s.defaultVisibility);
  const setDefaultVisibility = useSettings((s) => s.setDefaultVisibility);
  const deleteMyData = useData((s) => s.deleteMyData);
  const mine = useMyExperiences();
  const counts = VISIBILITIES.map((v) => ({ v, n: mine.filter((e) => e.visibility === v).length }));

  const confirmDelete = () =>
    Alert.alert(
      'Supprimer toutes mes données ?',
      'Expériences, photos, commentaires, réactions et amitiés seront définitivement supprimés. Action irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Tout supprimer',
          style: 'destructive',
          onPress: () => {
            deleteMyData();
            haptic.warning();
            toast('Toutes tes données ont été supprimées.');
            router.replace('/(tabs)');
          },
        },
      ],
    );

  return (
    <Screen edges="none">
      <SectionTitle>Visibilité par défaut</SectionTitle>
      <Card padded={false}>
        {VISIBILITIES.map((v, i) => {
          const meta = VISIBILITY_META[v];
          const active = defaultVisibility === v;
          return (
            <Pressable
              key={v}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              onPress={() => setDefaultVisibility(v)}
              style={[styles.option, { padding: spacing.lg, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }]}
            >
              <Ionicons name={meta.icon} size={20} color={active ? colors.accent : colors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">{meta.label}</Text>
                <Text variant="caption" tone="muted">
                  {meta.hint}
                </Text>
              </View>
              <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={22} color={active ? colors.accent : colors.textSubtle} />
            </Pressable>
          );
        })}
      </Card>

      <SectionTitle>Tes expériences aujourd’hui</SectionTitle>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {counts.map(({ v, n }) => (
          <Card key={v} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
            <Ionicons name={VISIBILITY_META[v].icon} size={16} color={colors.accent} />
            <Text variant="title">{n}</Text>
            <Text variant="caption" tone="muted">
              {VISIBILITY_META[v].label}
            </Text>
          </Card>
        ))}
      </View>

      <SectionTitle>Nos engagements</SectionTitle>
      <Card style={{ gap: spacing.md }}>
        {PROMISES.map((p) => (
          <View key={p.text} style={styles.promise}>
            <View style={[styles.promiseIcon, { backgroundColor: colors.accentSoft, borderRadius: radius.pill }]}>
              <Ionicons name={p.icon} size={16} color={colors.accent} />
            </View>
            <Text tone="muted" style={{ flex: 1 }}>
              {p.text}
            </Text>
          </View>
        ))}
      </Card>

      <SectionTitle>Zone sensible</SectionTitle>
      <Card style={{ gap: spacing.sm }}>
        <Text tone="muted">
          Supprime définitivement tes expériences, photos, commentaires, réactions et amis. Avec un compte en ligne, cette action supprimera aussi le compte.
        </Text>
        <Button label="Supprimer mes données" variant="danger" icon="trash-outline" onPress={confirmDelete} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  promise: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  promiseIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
