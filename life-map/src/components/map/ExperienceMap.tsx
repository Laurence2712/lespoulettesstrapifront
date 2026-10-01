import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, type Region as MapRegion } from 'react-native-maps';

import { Text } from '@/components/ui';
import { CATEGORIES } from '@/features/experiences/categories';
import { clusterExperiences, type Region } from '@/features/experiences/cluster';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

import { darkMapStyle } from './mapStyle';
import type { ExperienceMapHandle, ExperienceMapProps } from './types';

/**
 * Custom marker views need a few frames to render before we freeze them (tracksViewChanges=false)
 * for performance. Whenever `key` changes, markers track again for a short moment.
 */
function useFreezeAfterRender(key: string) {
  const [frozenKey, setFrozenKey] = useState<string | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setFrozenKey(key), 600);
    return () => clearTimeout(t);
  }, [key]);
  return frozenKey !== key;
}

export const ExperienceMap = forwardRef<ExperienceMapHandle, ExperienceMapProps>(function ExperienceMap(
  { experiences, initialRegion, selectedId, onSelect, onBackgroundPress, showsUserLocation, padding, interactive = true },
  ref,
) {
  const { colors, scheme } = useTheme();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(initialRegion);

  useImperativeHandle(ref, () => ({
    focus: (r) => mapRef.current?.animateToRegion(r, 650),
  }));

  const points = useMemo(() => clusterExperiences(experiences, region), [experiences, region]);
  const tracks = useFreezeAfterRender(`${points.map((p) => p.id).join(',')}|${selectedId ?? ''}|${scheme}`);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      initialRegion={initialRegion}
      onRegionChangeComplete={(r: MapRegion) => setRegion(r)}
      userInterfaceStyle={scheme}
      customMapStyle={Platform.OS === 'android' && scheme === 'dark' ? darkMapStyle : undefined}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
      showsPointsOfInterests={false}
      scrollEnabled={interactive}
      zoomEnabled={interactive}
      rotateEnabled={false}
      pitchEnabled={interactive}
      mapPadding={{ top: padding?.top ?? 0, bottom: padding?.bottom ?? 0, left: 0, right: 0 }}
      onPress={(e) => {
        // Marker presses also bubble a map press on Android; ignore those.
        if (e.nativeEvent.action !== 'marker-press') onBackgroundPress?.();
      }}
    >
      {points.map((p) => {
        if (p.kind === 'cluster') {
          return (
            <Marker
              key={p.id}
              coordinate={p.coordinate}
              tracksViewChanges={tracks}
              accessibilityLabel={`${p.experiences.length} expériences regroupées`}
              onPress={() => {
                haptic.tap();
                mapRef.current?.animateToRegion(
                  { ...p.coordinate, latitudeDelta: region.latitudeDelta / 3, longitudeDelta: region.longitudeDelta / 3 },
                  500,
                );
              }}
            >
              <View style={[styles.cluster, { backgroundColor: colors.accent, borderColor: colors.background }]}>
                <Text variant="bodyStrong" style={{ color: colors.accentText }}>
                  {p.experiences.length}
                </Text>
              </View>
            </Marker>
          );
        }
        const meta = CATEGORIES[p.experience.category];
        const selected = p.experience.id === selectedId;
        return (
          <Marker
            key={p.id}
            coordinate={p.coordinate}
            tracksViewChanges={tracks}
            anchor={{ x: 0.5, y: 1 }}
            accessibilityLabel={`${p.experience.title}, ${meta.label}`}
            onPress={() => {
              haptic.tap();
              onSelect(p.experience);
            }}
          >
            <View style={styles.pinWrap}>
              <View
                style={[
                  styles.pin,
                  {
                    backgroundColor: selected ? meta.color : colors.background,
                    borderColor: meta.color,
                    transform: [{ scale: selected ? 1.15 : 1 }],
                  },
                ]}
              >
                <Ionicons name={meta.icon} size={16} color={selected ? colors.background : meta.color} />
              </View>
              <View style={[styles.pinTail, { borderTopColor: meta.color }]} />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
});

const styles = StyleSheet.create({
  cluster: {
    minWidth: 40,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  pinWrap: { alignItems: 'center' },
  pin: { width: 36, height: 36, borderRadius: 18, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});
