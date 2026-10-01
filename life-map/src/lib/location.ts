import * as Location from 'expo-location';
import { Platform } from 'react-native';

import type { Coordinates } from '@/features/experiences/types';

export type PositionResult =
  | { status: 'granted'; coordinates: Coordinates }
  | { status: 'denied'; canAskAgain: boolean }
  | { status: 'error'; message: string };

/**
 * One-shot foreground position. Permission is requested only here, i.e. only when the
 * user taps a "use my position" action. Never watches, never runs in background.
 */
export async function getCurrentPosition(): Promise<PositionResult> {
  try {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') return { status: 'denied', canAskAgain: perm.canAskAgain };
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { status: 'granted', coordinates: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } };
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'Position indisponible.' };
  }
}

export type PlaceResult = { label: string; coordinates: Coordinates };

/**
 * Privacy-friendly place label: neighbourhood / city / country — never the street number,
 * so a private address isn't written into an experience without the user typing it.
 */
export function placeLabel(a: Pick<Location.LocationGeocodedAddress, 'name' | 'district' | 'city' | 'region' | 'country' | 'street' | 'streetNumber'>): string {
  const parts = [a.district ?? a.street ?? null, a.city ?? a.region ?? null, a.country].filter(
    (p): p is string => !!p && p.length > 0,
  );
  const unique = parts.filter((p, i) => parts.indexOf(p) === i);
  return unique.slice(0, 2).join(', ') || 'Lieu sans nom';
}

export async function reverseLabel(c: Coordinates): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  try {
    const [first] = await Location.reverseGeocodeAsync(c);
    return first ? placeLabel(first) : null;
  } catch {
    return null;
  }
}

/** Place search using the OS geocoder (Apple / Google Play services): no API key required. */
export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const q = query.trim();
  if (q.length < 2 || Platform.OS === 'web') return [];
  const results = await Location.geocodeAsync(q);
  const top = results.slice(0, 5);
  return Promise.all(
    top.map(async (r) => {
      const coordinates = { latitude: r.latitude, longitude: r.longitude };
      return { coordinates, label: (await reverseLabel(coordinates)) ?? q };
    }),
  );
}
