import { describe, expect, it } from '@jest/globals';
import { clusterExperiences, regionForExperiences } from '@/features/experiences/cluster';
import { applyFilters } from '@/features/experiences/filters';
import { experienceFormSchema, parseFrenchDate } from '@/features/experiences/schema';
import { computeStats } from '@/features/experiences/stats';
import type { Experience, Friendship } from '@/features/experiences/types';
import { areFriends, canView, filterVisible } from '@/features/experiences/visibility';

function exp(partial: Partial<Experience> & Pick<Experience, 'id'>): Experience {
  return {
    ownerId: 'me',
    title: 'Titre',
    media: [],
    category: 'travel',
    date: '2026-09-15',
    placeName: 'Bruxelles',
    visibility: 'private',
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z',
    ...partial,
  };
}

const friendships: Friendship[] = [
  { id: 'f1', requesterId: 'me', addresseeId: 'friend', status: 'accepted', createdAt: '' },
  { id: 'f2', requesterId: 'pending', addresseeId: 'me', status: 'pending', createdAt: '' },
];

describe('visibility rules (mirror of database RLS)', () => {
  it('owner always sees their own experiences', () => {
    expect(canView('me', exp({ id: '1', visibility: 'private' }), friendships)).toBe(true);
  });

  it('private experiences of others are never visible, even to friends', () => {
    expect(canView('friend', exp({ id: '1', visibility: 'private' }), friendships)).toBe(false);
    expect(canView('stranger', exp({ id: '1', visibility: 'private' }), friendships)).toBe(false);
    expect(canView(null, exp({ id: '1', visibility: 'private' }), friendships)).toBe(false);
  });

  it('friends-only experiences require an ACCEPTED friendship', () => {
    const e = exp({ id: '1', visibility: 'friends' });
    expect(canView('friend', e, friendships)).toBe(true);
    expect(canView('pending', e, friendships)).toBe(false);
    expect(canView('stranger', e, friendships)).toBe(false);
    expect(canView(null, e, friendships)).toBe(false);
  });

  it('public experiences are visible to everyone', () => {
    expect(canView('stranger', exp({ id: '1', visibility: 'public' }), friendships)).toBe(true);
  });

  it('friendship is symmetric and never with oneself', () => {
    expect(areFriends('friend', 'me', friendships)).toBe(true);
    expect(areFriends('me', 'me', friendships)).toBe(false);
  });

  it('filterVisible keeps only allowed items', () => {
    const list = [
      exp({ id: 'a', visibility: 'private' }),
      exp({ id: 'b', visibility: 'friends' }),
      exp({ id: 'c', visibility: 'public' }),
    ];
    expect(filterVisible('stranger', list, friendships).map((e) => e.id)).toEqual(['c']);
    expect(filterVisible('friend', list, friendships).map((e) => e.id)).toEqual(['b', 'c']);
  });
});

describe('computeStats', () => {
  const now = new Date(2026, 8, 30); // 30 Sept 2026
  const list = [
    exp({ id: '1', date: '2026-09-02', category: 'travel', placeName: 'Lisbonne', visibility: 'public' }),
    exp({ id: '2', date: '2026-09-10', category: 'travel', placeName: ' lisbonne ', visibility: 'private' }),
    exp({ id: '3', date: '2026-08-01', category: 'culture', coordinates: { latitude: 50.8441, longitude: 4.3571 }, visibility: 'friends' }),
    exp({ id: '4', date: '2026-08-02', category: 'culture', coordinates: { latitude: 50.84412, longitude: 4.35712 } }),
    exp({ id: '5', date: '2025-01-01', category: 'learning' }),
  ];
  const stats = computeStats(list, now);

  it('counts totals, private and shared', () => {
    expect(stats.total).toBe(5);
    expect(stats.privateCount).toBe(3);
    expect(stats.sharedCount).toBe(2);
  });

  it('dedupes places by normalised name and ~100 m coordinates', () => {
    // "Lisbonne" ×2 → 1, two nearby coords → 1, "Bruxelles" (exp 5) → 1
    expect(stats.distinctPlaces).toBe(3);
  });

  it('builds a zero-filled 6-month window ending this month', () => {
    expect(stats.byMonth.map((m) => m.key)).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']);
    expect(stats.byMonth.map((m) => m.count)).toEqual([0, 0, 0, 0, 2, 2]);
  });

  it('sorts categories by count and summarises the current month', () => {
    expect(stats.byCategory[0]).toEqual({ category: 'travel', count: 2 });
    expect(stats.currentMonth).toEqual({ count: 2, topCategory: 'travel', places: 1 });
  });

  it('handles an empty list', () => {
    const empty = computeStats([], now);
    expect(empty.total).toBe(0);
    expect(empty.byCategory).toEqual([]);
    expect(empty.currentMonth.topCategory).toBeNull();
  });
});

describe('clustering', () => {
  const list = [
    exp({ id: 'a', coordinates: { latitude: 50.84, longitude: 4.35 } }),
    exp({ id: 'b', coordinates: { latitude: 50.841, longitude: 4.351 } }),
    exp({ id: 'c', coordinates: { latitude: 38.71, longitude: -9.13 } }),
    exp({ id: 'd' }), // no coordinates → not on map
  ];

  it('merges nearby points when zoomed out', () => {
    const points = clusterExperiences(list, { latitudeDelta: 60, longitudeDelta: 60 });
    expect(points).toHaveLength(2);
    const cluster = points.find((p) => p.kind === 'cluster');
    expect(cluster && cluster.kind === 'cluster' ? cluster.experiences.map((e) => e.id).sort() : []).toEqual(['a', 'b']);
  });

  it('separates points when zoomed in', () => {
    const points = clusterExperiences(list, { latitudeDelta: 0.001, longitudeDelta: 0.001 });
    expect(points.filter((p) => p.kind === 'single')).toHaveLength(3);
  });

  it('computes a fitting region, or null without locations', () => {
    const r = regionForExperiences(list)!;
    expect(r.latitude).toBeCloseTo((50.841 + 38.71) / 2, 2);
    expect(regionForExperiences([exp({ id: 'x' })])).toBeNull();
  });
});

describe('form validation', () => {
  const valid = {
    title: 'Marché Dantokpa',
    category: 'travel',
    date: '2026-01-10',
    placeName: 'Cotonou',
    visibility: 'private',
    media: [],
  };

  it('accepts a minimal valid experience', () => {
    expect(experienceFormSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing title, place and category', () => {
    const r = experienceFormSchema.safeParse({ ...valid, title: ' ', placeName: '', category: undefined });
    expect(r.success).toBe(false);
    const fields = r.success ? [] : r.error.issues.map((i) => i.path[0]);
    expect(fields).toEqual(expect.arrayContaining(['title', 'placeName', 'category']));
  });

  it('rejects future and impossible dates', () => {
    expect(experienceFormSchema.safeParse({ ...valid, date: '2999-01-01' }).success).toBe(false);
    expect(experienceFormSchema.safeParse({ ...valid, date: '2025-02-30' }).success).toBe(false);
  });

  it('rejects out-of-range coordinates and too many photos', () => {
    expect(experienceFormSchema.safeParse({ ...valid, coordinates: { latitude: 91, longitude: 0 } }).success).toBe(false);
    const media = Array.from({ length: 7 }, (_, i) => ({ id: `${i}`, uri: 'file://x' }));
    expect(experienceFormSchema.safeParse({ ...valid, media }).success).toBe(false);
  });

  it('parses French dates', () => {
    expect(parseFrenchDate('3/7/2025')).toBe('2025-07-03');
    expect(parseFrenchDate('31/02/2025')).toBeNull();
    expect(parseFrenchDate('2025-07-03')).toBeNull();
  });
});

describe('filters', () => {
  const now = new Date(2026, 8, 30);
  const list = [
    exp({ id: 'recent', date: '2026-09-20', category: 'travel' }),
    exp({ id: 'spring', date: '2026-03-01', category: 'culture' }),
    exp({ id: 'old', date: '2024-05-01', category: 'travel' }),
  ];

  it('filters by period', () => {
    expect(applyFilters(list, { categories: [], period: '30d' }, now).map((e) => e.id)).toEqual(['recent']);
    expect(applyFilters(list, { categories: [], period: 'year' }, now).map((e) => e.id)).toEqual(['recent', 'spring']);
    expect(applyFilters(list, { categories: [], period: 'all' }, now)).toHaveLength(3);
  });

  it('filters by category', () => {
    expect(applyFilters(list, { categories: ['culture'], period: 'all' }, now).map((e) => e.id)).toEqual(['spring']);
  });
});
