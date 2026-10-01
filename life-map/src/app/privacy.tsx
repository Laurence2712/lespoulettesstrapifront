import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';

import { Button, Card, Screen, SectionTitle, Text, toast } from '@/components/ui';
import { VISIBILITY_META } from '@/features/experiences/categories';
import { updatePreferences } from '@/data/remote';
import { remoteUserId } from '@/features/auth/authStore';
import { syncFromServer, useData, useMe, useMyExperiences } from '@/features/experiences/store';
import { VISIBILITIES } from '@/features/experiences/types';
import { useSettings } from '@/features/settings/store';
import { haptic } from '@/lib/haptics';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme/ThemeProvider';

const PROMISES: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string }[] = [
  { icon: 'lock-closed-outline', text: 'Tes nouvelles expériences sont privées par défaut.' },
  { icon: 'navigate-outline', text: 'Ta position est demandée uniquement quand tu touches « Ma position ». Jamais de suivi en arrière-plan.' },
  { icon: 'home-outline', text: 'Le lieu proposé automatiquement s’arrête au quartier et à la ville : jamais de numéro de rue.' },
  { icon: 'eye-off-outline', text: 'Une expérience privée n’apparaît jamais dans le feed, la recherche ou le profil vu par les autres.' },
  { icon: 'image-outline', text: 'Avant envoi, chaque photo est ré-encodée : ses métadonnées (dont la position GPS) sont supprimées.' },
];

export default function PrivacyScreen() {
  const { colors, radius, spacing } = useTheme();
  const defaultVisibility = useSettings((s) => s.defaultVisibility);
  const setLocalDefaultVisibility = useSettings((s) => s.setDefaultVisibility);
  const deleteMyData = useData((s) => s.deleteMyData);
  const me = useMe();
  const [deleting, setDeleting] = useState(false);

  /** Saves a preference on the server (Supabase mode); reverts by re-syncing on failure. */
  const savePreference = (patch: Parameters<typeof updatePreferences>[2]) => {
    const meId = remoteUserId();
    if (!supabase || !meId) return;
    updatePreferences(supabase, meId, patch).catch(() => {
      toast('Préférence non enregistrée. Vérifie ta connexion.', 'error');
      void syncFromServer();
    });
  };

  const setDefaultVisibility = (v: (typeof VISIBILITIES)[number]) => {
    setLocalDefaultVisibility(v);
    savePreference({ default_visibility: v });
  };

  const setProfilePublic = (isPublic: boolean) => {
    useData.setState((s) => ({ profiles: s.profiles.map((p) => (p.id === s.meId ? { ...p, isPublic } : p)) }));
    savePreference({ is_public: isPublic });
  };
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
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteMyData();
              haptic.warning();
              toast(supabase ? 'Ton compte et tes données ont été supprimés.' : 'Toutes tes données ont été supprimées.');
              router.replace(supabase ? '/sign-in' : '/(tabs)');
            } catch (e) {
              toast(`Suppression impossible : ${e instanceof Error ? e.message : 'réessaie plus tard'}`, 'error');
            } finally {
              setDeleting(false);
            }
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

      <SectionTitle>Profil</SectionTitle>
      <Card style={styles.option}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong">Profil trouvable</Text>
          <Text variant="caption" tone="muted">
            {me.isPublic
              ? 'Tout le monde peut trouver ton profil. Tes expériences gardent leur propre visibilité.'
              : 'Seuls tes amis voient ton profil.'}
          </Text>
        </View>
        <Switch
          value={me.isPublic}
          onValueChange={setProfilePublic}
          trackColor={{ true: colors.accent, false: colors.surfaceRaised }}
          accessibilityLabel="Profil trouvable par tous"
        />
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
          {supabase
            ? 'Supprime définitivement ton compte, tes expériences, photos, commentaires, réactions et amitiés.'
            : 'Supprime définitivement tes expériences, photos, commentaires, réactions et amis de cet appareil.'}
        </Text>
        <Button
          label={supabase ? 'Supprimer mon compte' : 'Supprimer mes données'}
          variant="danger"
          icon="trash-outline"
          onPress={confirmDelete}
          loading={deleting}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  promise: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  promiseIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
