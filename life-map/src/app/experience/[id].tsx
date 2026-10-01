import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';

import { ReactionBar } from '@/components/experience/ReactionBar';
import { ExperienceMap } from '@/components/map/ExperienceMap';
import { Avatar, CategoryBadge, EmptyState, IconButton, Screen, SectionTitle, Text, toast } from '@/components/ui';
import { VISIBILITY_META } from '@/features/experiences/categories';
import { useMapFocus } from '@/features/experiences/mapFocus';
import { useData, useExperience, useProfile } from '@/features/experiences/store';
import { formatDate, timeAgo } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

export default function ExperienceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, radius, spacing } = useTheme();
  const { width } = useWindowDimensions();
  const experience = useExperience(id);
  const owner = useProfile(experience?.ownerId);
  const meId = useData((s) => s.meId);
  const allComments = useData((s) => s.comments);
  const profiles = useData((s) => s.profiles);
  const { addComment, deleteExperience } = useData.getState();
  const [draft, setDraft] = useState('');
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!experience) {
    // Either deleted, or not visible to this user: same message, no information leak.
    return (
      <Screen edges="none">
        <EmptyState icon="eye-off-outline" title="Expérience indisponible" message="Elle a été supprimée ou n’est pas partagée avec toi." />
      </Screen>
    );
  }

  const isMine = experience.ownerId === meId;
  const comments = allComments.filter((c) => c.experienceId === experience.id);
  const vis = VISIBILITY_META[experience.visibility];
  const photoWidth = width - spacing.lg * 2;

  const confirmDelete = () =>
    Alert.alert('Supprimer cette expérience ?', 'Elle disparaîtra de ta carte, avec ses photos, réactions et commentaires.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          deleteExperience(experience.id);
          haptic.warning();
          toast('Expérience supprimée.');
          router.back();
        },
      },
    ]);

  const send = () => {
    if (!draft.trim()) return;
    addComment(experience.id, draft);
    setDraft('');
    haptic.tap();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <Stack.Screen
        options={{
          title: '',
          headerRight: isMine
            ? () => (
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <IconButton icon="create-outline" label="Modifier" tone="plain" size={40} onPress={() => router.push(`/experience/edit/${experience.id}`)} />
                  <IconButton icon="trash-outline" label="Supprimer" tone="plain" size={40} onPress={confirmDelete} />
                </View>
              )
            : undefined,
        }}
      />
      <Screen edges="none">
        {experience.media.length ? (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / photoWidth))}
              style={{ borderRadius: radius.lg }}
            >
              {experience.media.map((m) => (
                <Image
                  key={m.id}
                  source={{ uri: m.uri }}
                  style={{ width: photoWidth, aspectRatio: 4 / 3 }}
                  contentFit="cover"
                  transition={250}
                  accessibilityLabel={`Photo de ${experience.title}`}
                />
              ))}
            </ScrollView>
            {experience.media.length > 1 ? (
              <View style={styles.dots}>
                {experience.media.map((m, i) => (
                  <View key={m.id} style={[styles.dot, { backgroundColor: i === photoIndex ? colors.accent : colors.textSubtle }]} />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={{ gap: spacing.sm }}>
          <View style={styles.row}>
            <CategoryBadge category={experience.category} />
            <View style={[styles.row, { gap: 4 }]} accessibilityLabel={`Visibilité : ${vis.label}`}>
              <Ionicons name={vis.icon} size={13} color={colors.textSubtle} />
              <Text variant="caption" tone="subtle">
                {vis.label}
              </Text>
            </View>
          </View>
          <Text variant="display" accessibilityRole="header">
            {experience.title}
          </Text>
          <View style={[styles.row, { gap: 4 }]}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text tone="muted">{formatDate(experience.date)}</Text>
          </View>
          <View style={[styles.row, { gap: 4 }]}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text tone="muted" style={{ flex: 1 }}>
              {experience.placeName}
            </Text>
          </View>
        </View>

        {owner && !isMine ? (
          <Pressable accessibilityRole="link" onPress={() => router.push(`/user/${owner.username}`)} style={[styles.row, { gap: 10 }]}>
            <Avatar uri={owner.avatarUrl} name={owner.displayName} size={36} />
            <View>
              <Text variant="bodyStrong">{owner.displayName}</Text>
              <Text variant="caption" tone="subtle">
                @{owner.username}
              </Text>
            </View>
          </Pressable>
        ) : null}

        {experience.description ? <Text style={{ fontSize: 17, lineHeight: 26 }}>{experience.description}</Text> : null}

        {experience.coordinates ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voir sur la carte"
            onPress={() => {
              useMapFocus.getState().focus(experience.id);
              router.navigate('/(tabs)');
            }}
            style={[styles.map, { borderRadius: radius.lg, borderColor: colors.border }]}
          >
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              <ExperienceMap
                experiences={[experience]}
                initialRegion={{ ...experience.coordinates, latitudeDelta: 0.03, longitudeDelta: 0.03 }}
                selectedId={experience.id}
                interactive={false}
                onSelect={() => {}}
              />
            </View>
          </Pressable>
        ) : null}

        {experience.visibility !== 'private' || !isMine ? (
          <ReactionBar experienceId={experience.id} commentCount={comments.length} />
        ) : null}

        {experience.visibility === 'private' && isMine ? (
          <View style={[styles.note, { backgroundColor: colors.accentSoft, borderRadius: radius.md }]}>
            <Ionicons name="lock-closed" size={14} color={colors.accent} />
            <Text variant="caption" tone="accent" style={{ flex: 1 }}>
              Expérience privée : personne d’autre ne peut la voir, la commenter ou y réagir.
            </Text>
          </View>
        ) : (
          <>
            <SectionTitle>{`Commentaires · ${comments.length}`}</SectionTitle>
            {comments.length === 0 ? (
              <Text tone="subtle">Pas encore de commentaire. Lance la conversation.</Text>
            ) : (
              comments.map((c) => {
                const author = profiles.find((p) => p.id === c.authorId);
                return (
                  <View key={c.id} style={[styles.row, { alignItems: 'flex-start', gap: 10 }]}>
                    <Avatar uri={author?.avatarUrl} name={author?.displayName ?? '?'} size={32} />
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text variant="caption">
                        <Text variant="caption" style={{ fontWeight: '700' }}>
                          {author?.displayName ?? 'Utilisateur'}
                        </Text>
                        <Text variant="caption" tone="subtle">
                          {`  ${timeAgo(c.createdAt)}`}
                        </Text>
                      </Text>
                      <Text>{c.body}</Text>
                    </View>
                  </View>
                );
              })
            )}
            <View style={[styles.composer, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.pill }]}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Écrire un commentaire…"
                placeholderTextColor={colors.textSubtle}
                accessibilityLabel="Écrire un commentaire"
                maxLength={500}
                onSubmitEditing={send}
                returnKeyType="send"
                style={{ flex: 1, color: colors.text, fontSize: 16, minHeight: 44 }}
              />
              <IconButton icon="arrow-up" label="Envoyer" tone="accent" size={36} onPress={send} />
            </View>
          </>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  map: { height: 160, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 16, paddingRight: 6, borderWidth: StyleSheet.hairlineWidth },
});
