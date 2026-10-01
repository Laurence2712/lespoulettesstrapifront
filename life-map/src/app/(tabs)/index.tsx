import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExperienceMap } from '@/components/map/ExperienceMap';
import { WORLD_REGION, type ExperienceMapHandle } from '@/components/map/types';
import { ExperiencePeek } from '@/components/experience/ExperiencePeek';
import { Button, Chip, IconButton, Text, TAB_BAR_SPACE, toast } from '@/components/ui';
import { CATEGORY_LIST } from '@/features/experiences/categories';
import { regionForExperiences } from '@/features/experiences/cluster';
import { useMapFocus } from '@/features/experiences/mapFocus';
import { EMPTY_FILTERS, PERIOD_LABELS, applyFilters, type ExperienceFilters, type PeriodFilter } from '@/features/experiences/filters';
import { useCommunityExperiences, useData, useMyExperiences } from '@/features/experiences/store';
import type { CategoryId } from '@/features/experiences/types';
import { getCurrentPosition, searchPlaces, type PlaceResult } from '@/lib/location';
import { useTheme } from '@/theme/ThemeProvider';

type Layer = 'mine' | 'all';

export default function ExploreScreen() {
  const { colors, radius, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<ExperienceMapHandle>(null);

  const mine = useMyExperiences();
  const others = useCommunityExperiences();
  const unread = useData((s) => s.notifications.filter((n) => n.recipientId === s.meId && !n.read).length);

  const [layer, setLayer] = useState<Layer>('mine');
  const [filters, setFilters] = useState<ExperienceFilters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const selectedId = useMapFocus((s) => s.selectedId);
  const select = useMapFocus((s) => s.select);
  const focusRequest = useMapFocus((s) => s.request);
  const [userLocation, setUserLocation] = useState(false);
  const [locating, setLocating] = useState(false);

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<PlaceResult[] | null>(null);

  const all = useMemo(() => [...mine, ...others], [mine, others]);
  const visible = useMemo(() => applyFilters(layer === 'mine' ? mine : all, filters), [all, filters, layer, mine]);
  const selected = selectedId ? (all.find((e) => e.id === selectedId) ?? null) : null;
  const located = visible.filter((e) => e.coordinates);
  const initialRegion = useMemo(() => regionForExperiences(mine) ?? WORLD_REGION, []); // eslint-disable-line react-hooks/exhaustive-deps
  const activeFilterCount = filters.categories.length + (filters.period !== 'all' ? 1 : 0);

  // Another screen (Add, detail) asked to fly to an experience.
  useEffect(() => {
    if (!focusRequest) return;
    const target = all.find((e) => e.id === focusRequest.id);
    if (target?.coordinates) mapRef.current?.focus({ ...target.coordinates, latitudeDelta: 0.05, longitudeDelta: 0.05 });
  }, [focusRequest]); // eslint-disable-line react-hooks/exhaustive-deps -- only react to new requests

  const centerOnMine = () => {
    const r = regionForExperiences(layer === 'mine' ? located : mine);
    if (r) mapRef.current?.focus(r);
    else toast('Aucune expérience localisée pour le moment.');
  };

  const locateMe = async () => {
    setLocating(true);
    const res = await getCurrentPosition();
    setLocating(false);
    if (res.status === 'granted') {
      setUserLocation(true);
      mapRef.current?.focus({ ...res.coordinates, latitudeDelta: 0.04, longitudeDelta: 0.04 });
    } else if (res.status === 'denied') {
      toast(res.canAskAgain ? 'Localisation non autorisée.' : 'Localisation désactivée — modifiable dans les réglages.', 'error');
      if (!res.canAskAgain) Linking.openSettings().catch(() => {});
    } else {
      toast('Position indisponible pour le moment.', 'error');
    }
  };

  const runSearch = async () => {
    Keyboard.dismiss();
    if (query.trim().length < 2) return;
    setSearching(true);
    try {
      setResults(await searchPlaces(query));
    } catch {
      toast('Recherche indisponible. Vérifie ta connexion.', 'error');
      setResults(null);
    } finally {
      setSearching(false);
    }
  };

  const toggleCategory = (id: CategoryId) =>
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(id) ? f.categories.filter((c) => c !== id) : [...f.categories, id],
    }));

  const overlayTop = insets.top + 8;
  const bottomOffset = TAB_BAR_SPACE + insets.bottom - 16;

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ExperienceMap
        ref={mapRef}
        experiences={visible}
        initialRegion={initialRegion}
        selectedId={selected?.id}
        onSelect={(e) => select(e.id)}
        onBackgroundPress={() => {
          select(null);
          setResults(null);
        }}
        showsUserLocation={userLocation}
        padding={{ top: overlayTop + 60, bottom: bottomOffset }}
      />

      {/* Top overlay: search + layers */}
      <View style={[styles.top, { paddingTop: overlayTop, paddingHorizontal: spacing.lg, gap: spacing.sm }]} pointerEvents="box-none">
        <View style={styles.row}>
          <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.pill }]}>
            <Ionicons name="search" size={18} color={colors.textSubtle} />
            <TextInput
              value={query}
              onChangeText={(t) => {
                setQuery(t);
                if (!t) setResults(null);
              }}
              onSubmitEditing={runSearch}
              placeholder="Rechercher un lieu"
              placeholderTextColor={colors.textSubtle}
              returnKeyType="search"
              accessibilityLabel="Rechercher un lieu"
              style={[styles.searchInput, { color: colors.text }]}
            />
            {searching ? <ActivityIndicator color={colors.accent} /> : null}
          </View>
          <IconButton icon="notifications-outline" label="Notifications" onPress={() => router.push('/notifications')} badge={unread > 0} />
        </View>

        {results ? (
          <View style={[styles.results, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}>
            {results.length === 0 ? (
              <Text tone="muted" style={{ padding: spacing.md }}>
                Aucun lieu trouvé.
              </Text>
            ) : (
              results.map((r, i) => (
                <Pressable
                  key={`${r.label}-${i}`}
                  accessibilityRole="button"
                  onPress={() => {
                    mapRef.current?.focus({ ...r.coordinates, latitudeDelta: 0.08, longitudeDelta: 0.08 });
                    setResults(null);
                  }}
                  style={[styles.resultRow, { padding: spacing.md, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }]}
                >
                  <Ionicons name="location-outline" size={16} color={colors.accent} />
                  <Text numberOfLines={1} style={{ flex: 1 }}>
                    {r.label}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          <Chip label="Ma carte" icon="person" selected={layer === 'mine'} onPress={() => setLayer('mine')} />
          <Chip label="Amis & communauté" icon="people" selected={layer === 'all'} onPress={() => setLayer('all')} />
          <Chip
            label={activeFilterCount ? `Filtres · ${activeFilterCount}` : 'Filtres'}
            icon="options-outline"
            selected={showFilters || activeFilterCount > 0}
            onPress={() => setShowFilters((v) => !v)}
          />
        </ScrollView>

        {showFilters ? (
          <View style={[styles.filters, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm }]}>
            <Text variant="overline" tone="muted">
              Période
            </Text>
            <View style={styles.wrap}>
              {(Object.keys(PERIOD_LABELS) as PeriodFilter[]).map((p) => (
                <Chip key={p} label={PERIOD_LABELS[p]} selected={filters.period === p} onPress={() => setFilters((f) => ({ ...f, period: p }))} />
              ))}
            </View>
            <Text variant="overline" tone="muted">
              Catégories
            </Text>
            <View style={styles.wrap}>
              {CATEGORY_LIST.map((c) => (
                <Chip key={c.id} label={c.label} dotColor={c.color} selected={filters.categories.includes(c.id)} onPress={() => toggleCategory(c.id)} />
              ))}
            </View>
            {activeFilterCount ? <Button label="Réinitialiser" variant="ghost" size="sm" onPress={() => setFilters(EMPTY_FILTERS)} /> : null}
          </View>
        ) : null}
      </View>

      {/* Bottom overlay: floating actions + selected card */}
      <View style={[styles.bottom, { bottom: bottomOffset, paddingHorizontal: spacing.lg, gap: spacing.md }]} pointerEvents="box-none">
        <View style={[styles.fabs, { gap: spacing.sm }]} pointerEvents="box-none">
          <IconButton icon="scan-outline" label="Centrer sur mes expériences" onPress={centerOnMine} />
          <IconButton icon={locating ? 'hourglass-outline' : 'navigate-outline'} label="Ma position" onPress={locateMe} />
        </View>

        {selected ? (
          <ExperiencePeek experience={selected} onClose={() => select(null)} />
        ) : located.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm }]}>
            <Text variant="heading">{mine.length === 0 ? 'Ta carte t’attend' : 'Rien à afficher ici'}</Text>
            <Text tone="muted">
              {mine.length === 0
                ? 'Ajoute ta première expérience : un lieu, un moment, une rencontre.'
                : 'Aucune expérience localisée ne correspond à ces filtres.'}
            </Text>
            {mine.length === 0 ? (
              <Button label="Ajouter une expérience" icon="add" onPress={() => router.navigate('/add')} />
            ) : (
              <Button label="Réinitialiser les filtres" variant="secondary" onPress={() => setFilters(EMPTY_FILTERS)} />
            )}
          </View>
        ) : (
          <View style={[styles.counter, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.pill }]}>
            <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            <Text variant="caption" style={{ fontWeight: '600' }}>
              {located.length} {located.length > 1 ? 'expériences sur la carte' : 'expérience sur la carte'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  top: { position: 'absolute', left: 0, right: 0, top: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: { flex: 1, fontSize: 16, height: '100%' },
  results: { borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filters: { borderWidth: StyleSheet.hairlineWidth },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bottom: { position: 'absolute', left: 0, right: 0 },
  fabs: { alignSelf: 'flex-end' },
  empty: { borderWidth: StyleSheet.hairlineWidth },
  counter: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
