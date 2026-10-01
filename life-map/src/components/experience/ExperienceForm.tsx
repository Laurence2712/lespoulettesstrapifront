import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { z } from 'zod';

import { LocationPicker } from '@/components/map/LocationPicker';
import { Button, Chip, Field, Text, toast } from '@/components/ui';
import { CATEGORY_LIST, VISIBILITY_META } from '@/features/experiences/categories';
import { experienceFormSchema, parseFrenchDate, toISODate, type ExperienceFormValues } from '@/features/experiences/schema';
import { VISIBILITIES, type Experience } from '@/features/experiences/types';
import { useSettings } from '@/features/settings/store';
import { formatDate } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { getCurrentPosition, reverseLabel, searchPlaces } from '@/lib/location';
import { useTheme } from '@/theme/ThemeProvider';

type FormInput = z.input<typeof experienceFormSchema>;

const MAX_PHOTOS = 6;

function today() {
  return toISODate(new Date());
}
function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toISODate(d);
}

export function ExperienceForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Experience;
  submitLabel: string;
  onSubmit: (values: ExperienceFormValues) => void | Promise<void>;
}) {
  const { colors, radius, spacing } = useTheme();
  const defaultVisibility = useSettings((s) => s.defaultVisibility);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description ?? '',
          category: initial.category,
          date: initial.date,
          placeName: initial.placeName,
          coordinates: initial.coordinates,
          visibility: initial.visibility,
          media: initial.media,
        }
      : { title: '', description: '', date: today(), placeName: '', visibility: defaultVisibility, media: [] },
    mode: 'onSubmit',
  });

  const date = useWatch({ control, name: 'date' });
  const media = useWatch({ control, name: 'media' }) ?? [];
  const coordinates = useWatch({ control, name: 'coordinates' });
  const placeName = useWatch({ control, name: 'placeName' }) ?? '';
  const visibility = useWatch({ control, name: 'visibility' }) ?? 'private';

  const [dateMode, setDateMode] = useState<'today' | 'yesterday' | 'other'>(
    !initial || initial.date === today() ? 'today' : initial.date === yesterday() ? 'yesterday' : 'other',
  );
  const [customDate, setCustomDate] = useState('');
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [showMap, setShowMap] = useState(!!initial?.coordinates);

  const pickPhotos = async () => {
    const remaining = MAX_PHOTOS - media.length;
    if (remaining <= 0) return toast(`${MAX_PHOTOS} photos maximum.`);
    // The system photo picker does not require a library permission on iOS 14+ / Android 13+.
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
      exif: false,
    });
    if (res.canceled) return;
    const added = res.assets.slice(0, remaining).map((a) => ({ id: Crypto.randomUUID(), uri: a.uri, width: a.width, height: a.height }));
    setValue('media', [...media, ...added], { shouldValidate: true });
  };

  const useMyPosition = async () => {
    setLocating(true);
    const res = await getCurrentPosition();
    setLocating(false);
    if (res.status !== 'granted') {
      toast(res.status === 'denied' ? 'Localisation refusée : indique le lieu à la main.' : 'Position indisponible.', 'error');
      return;
    }
    setValue('coordinates', res.coordinates);
    setShowMap(true);
    if (!placeName.trim()) {
      const label = await reverseLabel(res.coordinates);
      if (label) setValue('placeName', label, { shouldValidate: true });
    }
  };

  const locatePlaceName = async () => {
    if (placeName.trim().length < 2) return toast('Écris d’abord le nom du lieu.');
    setGeocoding(true);
    try {
      const [first] = await searchPlaces(placeName);
      if (first) {
        setValue('coordinates', first.coordinates);
        setShowMap(true);
      } else toast('Lieu introuvable — place-le sur la carte.');
    } catch {
      toast('Recherche indisponible.', 'error');
    } finally {
      setGeocoding(false);
    }
  };

  const submit = handleSubmit(
    async (values) => {
      await onSubmit(values);
      if (!initial) {
        reset({ title: '', description: '', date: today(), placeName: '', visibility: defaultVisibility, media: [], coordinates: undefined });
        setDateMode('today');
        setCustomDate('');
        setShowMap(false);
      }
    },
    () => {
      haptic.warning();
      toast('Quelques champs sont à compléter.', 'error');
    },
  );

  return (
    <View style={{ gap: spacing.xl }}>
      {/* Photos */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ajouter des photos"
          onPress={pickPhotos}
          style={({ pressed }) => [
            styles.photo,
            styles.addPhoto,
            { borderRadius: radius.md, borderColor: colors.accent, backgroundColor: colors.accentSoft, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="images-outline" size={24} color={colors.accent} />
          <Text variant="caption" tone="accent" style={{ fontWeight: '600' }}>
            {media.length ? `${media.length}/${MAX_PHOTOS}` : 'Photos'}
          </Text>
        </Pressable>
        {media.map((m) => (
          <View key={m.id} style={[styles.photo, { borderRadius: radius.md, overflow: 'hidden' }]}>
            <Image source={{ uri: m.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retirer la photo"
              hitSlop={8}
              onPress={() => setValue('media', media.filter((x) => x.id !== m.id))}
              style={[styles.removePhoto, { backgroundColor: colors.overlay }]}
            >
              <Ionicons name="close" size={14} color="#fff" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <Field
            label="Titre"
            placeholder="Un moment à retenir…"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.title?.message}
            returnKeyType="next"
            maxLength={80}
            testID="title-input"
          />
        )}
      />

      {/* Category */}
      <View style={{ gap: spacing.sm }}>
        <Text variant="overline" tone="muted">
          Catégorie
        </Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View style={styles.wrap}>
              {CATEGORY_LIST.map((c) => (
                <Chip key={c.id} testID={`category-${c.id}`} label={c.label} icon={c.icon} selected={value === c.id} onPress={() => onChange(c.id)} />
              ))}
            </View>
          )}
        />
        {errors.category ? (
          <Text variant="caption" tone="danger">
            {errors.category.message}
          </Text>
        ) : null}
      </View>

      {/* Date */}
      <View style={{ gap: spacing.sm }}>
        <Text variant="overline" tone="muted">
          Quand
        </Text>
        <View style={styles.wrap}>
          <Chip label="Aujourd’hui" selected={dateMode === 'today'} onPress={() => { setDateMode('today'); setValue('date', today(), { shouldValidate: true }); }} />
          <Chip label="Hier" selected={dateMode === 'yesterday'} onPress={() => { setDateMode('yesterday'); setValue('date', yesterday(), { shouldValidate: true }); }} />
          <Chip label={dateMode === 'other' && date ? formatDate(date) : 'Autre date'} icon="calendar-outline" selected={dateMode === 'other'} onPress={() => setDateMode('other')} />
        </View>
        {dateMode === 'other' ? (
          <Field
            label="Date (JJ/MM/AAAA)"
            placeholder="14/07/2025"
            keyboardType="numbers-and-punctuation"
            value={customDate}
            maxLength={10}
            onChangeText={(t) => {
              setCustomDate(t);
              const iso = parseFrenchDate(t);
              if (iso) setValue('date', iso, { shouldValidate: true });
            }}
            error={customDate.length >= 8 && !parseFrenchDate(customDate) ? 'Date invalide ou dans le futur.' : errors.date?.message}
          />
        ) : null}
      </View>

      {/* Place */}
      <View style={{ gap: spacing.sm }}>
        <Controller
          control={control}
          name="placeName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Field
              label="Lieu"
              placeholder="Café du coin, Lisbonne, Mont Blanc…"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.placeName?.message}
              maxLength={120}
              testID="place-input"
            />
          )}
        />
        <View style={styles.wrap}>
          <Button label="Ma position" icon="navigate-outline" variant="secondary" size="sm" loading={locating} onPress={useMyPosition} />
          <Button label="Trouver ce lieu" icon="search" variant="secondary" size="sm" loading={geocoding} onPress={locatePlaceName} />
          <Button
            label={showMap ? 'Masquer la carte' : 'Placer sur la carte'}
            icon="map-outline"
            variant="ghost"
            size="sm"
            onPress={() => setShowMap((v) => !v)}
          />
        </View>
        {showMap ? (
          <LocationPicker value={coordinates} onChange={(c) => setValue('coordinates', c)} />
        ) : null}
        <View style={styles.row}>
          <Ionicons name={coordinates ? 'location' : 'location-outline'} size={14} color={coordinates ? colors.accent : colors.textSubtle} />
          <Text variant="caption" tone={coordinates ? 'accent' : 'subtle'} style={{ flex: 1 }}>
            {coordinates ? 'Position enregistrée — l’expérience apparaîtra sur ta carte.' : 'Sans position, l’expérience reste dans ta liste mais pas sur la carte.'}
          </Text>
          {coordinates ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Retirer la position" hitSlop={8} onPress={() => setValue('coordinates', undefined)}>
              <Text variant="caption" tone="muted" style={{ textDecorationLine: 'underline' }}>
                Retirer
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <Field
            label="Note"
            optional
            multiline
            placeholder="Ce que tu veux te rappeler…"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.description?.message}
            maxLength={1000}
          />
        )}
      />

      {/* Visibility */}
      <View style={{ gap: spacing.sm }}>
        <Text variant="overline" tone="muted">
          Qui peut voir ?
        </Text>
        <Controller
          control={control}
          name="visibility"
          render={({ field: { onChange, value } }) => (
            <View style={[styles.segment, { backgroundColor: colors.surface, borderRadius: radius.md, borderColor: colors.border }]}>
              {VISIBILITIES.map((v) => {
                const meta = VISIBILITY_META[v];
                const active = value === v;
                return (
                  <Pressable
                    key={v}
                    testID={`visibility-${v}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                    accessibilityLabel={`${meta.label} : ${meta.hint}`}
                    onPress={() => {
                      haptic.tap();
                      onChange(v);
                    }}
                    style={[styles.segmentItem, { borderRadius: radius.sm, backgroundColor: active ? colors.accent : 'transparent' }]}
                  >
                    <Ionicons name={meta.icon} size={16} color={active ? colors.accentText : colors.textMuted} />
                    <Text variant="caption" style={{ fontWeight: '700', color: active ? colors.accentText : colors.text }}>
                      {meta.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
        <Text variant="caption" tone="subtle">
          {VISIBILITY_META[visibility].hint}. Modifiable à tout moment.
        </Text>
      </View>

      <Button label={submitLabel} icon="checkmark" onPress={submit} loading={isSubmitting} fullWidth testID="submit-experience" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  photo: { width: 84, height: 84 },
  addPhoto: { alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1.5, borderStyle: 'dashed' },
  removePhoto: { position: 'absolute', top: 5, right: 5, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  segment: { flexDirection: 'row', padding: 4, borderWidth: StyleSheet.hairlineWidth },
  segmentItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44 },
});
