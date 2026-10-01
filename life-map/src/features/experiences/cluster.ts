import type { Coordinates, Experience } from './types';

export type Region = Coordinates & { latitudeDelta: number; longitudeDelta: number };

export type MapPoint =
  | { kind: 'single'; id: string; coordinate: Coordinates; experience: Experience }
  | { kind: 'cluster'; id: string; coordinate: Coordinates; experiences: Experience[] };

/**
 * Grid clustering: the visible region is split into roughly `cellsAcross` columns;
 * experiences falling into the same cell are merged. Cheap, deterministic and good
 * enough for personal maps (hundreds to low thousands of points).
 */
export function clusterExperiences(
  experiences: readonly Experience[],
  region: Pick<Region, 'latitudeDelta' | 'longitudeDelta'>,
  cellsAcross = 6,
): MapPoint[] {
  const cellLat = Math.max(region.latitudeDelta / cellsAcross, 1e-6);
  const cellLng = Math.max(region.longitudeDelta / cellsAcross, 1e-6);
  const cells = new Map<string, Experience[]>();

  for (const e of experiences) {
    if (!e.coordinates) continue;
    const key = `${Math.floor(e.coordinates.latitude / cellLat)}:${Math.floor(e.coordinates.longitude / cellLng)}`;
    const bucket = cells.get(key);
    if (bucket) bucket.push(e);
    else cells.set(key, [e]);
  }

  const points: MapPoint[] = [];
  for (const [key, group] of cells) {
    if (group.length === 1) {
      const e = group[0]!;
      points.push({ kind: 'single', id: e.id, coordinate: e.coordinates!, experience: e });
    } else {
      const latitude = group.reduce((s, e) => s + e.coordinates!.latitude, 0) / group.length;
      const longitude = group.reduce((s, e) => s + e.coordinates!.longitude, 0) / group.length;
      points.push({ kind: 'cluster', id: `cluster-${key}`, coordinate: { latitude, longitude }, experiences: group });
    }
  }
  return points;
}

/** Region that fits every located experience, with padding. Null when nothing is located. */
export function regionForExperiences(experiences: readonly Experience[]): Region | null {
  const located = experiences.filter((e) => e.coordinates);
  if (located.length === 0) return null;
  const lats = located.map((e) => e.coordinates!.latitude);
  const lngs = located.map((e) => e.coordinates!.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.min(Math.max((maxLat - minLat) * 1.4, 0.05), 160),
    longitudeDelta: Math.min(Math.max((maxLng - minLng) * 1.4, 0.05), 340),
  };
}
