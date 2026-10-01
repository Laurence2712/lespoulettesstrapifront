import { CATEGORY_IDS, type CategoryId, type Experience } from './types';

export type MonthBucket = { key: string; label: string; count: number };

export type ExperienceStats = {
  total: number;
  distinctPlaces: number;
  byCategory: { category: CategoryId; count: number }[];
  byMonth: MonthBucket[];
  privateCount: number;
  sharedCount: number;
  currentMonth: { count: number; topCategory: CategoryId | null; places: number };
};

const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

/** Normalise a place to count "Paris" and "paris " as the same place; rounds coordinates to ~100 m. */
export function placeKey(e: Pick<Experience, 'placeName' | 'coordinates'>): string {
  if (e.coordinates) {
    return `${e.coordinates.latitude.toFixed(3)},${e.coordinates.longitude.toFixed(3)}`;
  }
  return e.placeName.trim().toLowerCase();
}

function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

/** Last `months` calendar months ending at `now`, oldest first, zero-filled. */
function monthWindow(now: Date, months: number): MonthBucket[] {
  const buckets: MonthBucket[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets.push({ key, label: MONTHS_FR[d.getMonth()]!, count: 0 });
  }
  return buckets;
}

export function computeStats(experiences: readonly Experience[], now: Date = new Date(), months = 6): ExperienceStats {
  const categoryCounts = new Map<CategoryId, number>(CATEGORY_IDS.map((c) => [c, 0]));
  const places = new Set<string>();
  const byMonth = monthWindow(now, months);
  const monthIndex = new Map(byMonth.map((b, i) => [b.key, i]));
  const currentKey = byMonth[byMonth.length - 1]!.key;
  const currentPlaces = new Set<string>();
  const currentCategories = new Map<CategoryId, number>();
  let privateCount = 0;
  let currentCount = 0;

  for (const e of experiences) {
    categoryCounts.set(e.category, (categoryCounts.get(e.category) ?? 0) + 1);
    places.add(placeKey(e));
    if (e.visibility === 'private') privateCount++;
    const key = monthKey(e.date);
    const idx = monthIndex.get(key);
    if (idx !== undefined) byMonth[idx]!.count++;
    if (key === currentKey) {
      currentCount++;
      currentPlaces.add(placeKey(e));
      currentCategories.set(e.category, (currentCategories.get(e.category) ?? 0) + 1);
    }
  }

  let topCategory: CategoryId | null = null;
  let topCount = 0;
  for (const [cat, count] of currentCategories) {
    if (count > topCount) {
      topCategory = cat;
      topCount = count;
    }
  }

  return {
    total: experiences.length,
    distinctPlaces: places.size,
    byCategory: [...categoryCounts.entries()]
      .map(([category, count]) => ({ category, count }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count),
    byMonth,
    privateCount,
    sharedCount: experiences.length - privateCount,
    currentMonth: { count: currentCount, topCategory, places: currentPlaces.size },
  };
}
