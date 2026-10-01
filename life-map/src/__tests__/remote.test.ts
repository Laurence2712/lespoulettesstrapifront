import { describe, expect, it, jest } from '@jest/globals';

import { isLocalMedia, mediaPath, toExperience, toExperienceWrite, toNotification } from '@/data/mappers';
import { fetchSnapshot } from '@/data/remote';
import type { LifeMapClient } from '@/lib/supabase';

jest.mock('expo-image-manipulator', () => ({ ImageManipulator: { manipulate: jest.fn() }, SaveFormat: { JPEG: 'jpeg' } }));

const ME = 'me-uuid';
const FRIEND = 'friend-uuid';

const fixtures: Record<string, unknown[]> = {
  experiences: [
    { id: 'e1', owner_id: ME, title: 'Lisbonne', description: null, category: 'travel', happened_on: '2026-09-01', place_name: 'Alfama', latitude: 38.7, longitude: -9.1, visibility: 'private', created_at: 't', updated_at: 't' },
    { id: 'e2', owner_id: FRIEND, title: 'Plage', description: 'Golden hour', category: 'discovery', happened_on: '2026-09-02', place_name: 'Cotonou', latitude: null, longitude: null, visibility: 'friends', created_at: 't', updated_at: 't' },
  ],
  experience_media: [
    { id: 'm1', experience_id: 'e1', owner_id: ME, storage_path: `${ME}/e1/m1.jpg`, width: 800, height: 600, position: 0, created_at: 't' },
  ],
  friendships: [{ id: 'f1', requester_id: ME, addressee_id: FRIEND, status: 'accepted', created_at: 't', responded_at: 't' }],
  notifications: [{ id: 'n1', recipient_id: ME, actor_id: FRIEND, type: 'comment', experience_id: 'e1', created_at: 't', read_at: null }],
  reactions: [{ experience_id: 'e2', user_id: ME, kind: 'love', created_at: 't' }],
  comments: [{ id: 'c1', experience_id: 'e1', author_id: FRIEND, body: 'Superbe', created_at: 't' }],
  profiles: [
    { id: ME, username: 'me', display_name: 'Moi', bio: null, avatar_path: `${ME}/avatar.jpg`, is_public: true, default_visibility: 'friends', onboarded: true, created_at: 't', updated_at: 't' },
    { id: FRIEND, username: 'yao', display_name: 'Yao', bio: 'Photographe', avatar_path: null, is_public: true, default_visibility: 'private', onboarded: true, created_at: 't', updated_at: 't' },
  ],
};

/** Minimal chainable stand-in for supabase-js: records filters, resolves to fixtures. */
function fakeClient() {
  const calls: { table: string; ops: string[] }[] = [];
  const client = {
    from(table: string) {
      const entry = { table, ops: [] as string[] };
      calls.push(entry);
      const builder: Record<string, unknown> = {};
      for (const op of ['select', 'eq', 'neq', 'in', 'order', 'limit', 'or', 'is']) {
        builder[op] = (...args: unknown[]) => {
          entry.ops.push(`${op}(${args.map((a) => JSON.stringify(a)).join(',')})`);
          return builder;
        };
      }
      builder.then = (resolve: (v: unknown) => void) => {
        let rows = fixtures[table] ?? [];
        if (table === 'experiences') {
          const eq = entry.ops.find((o) => o.startsWith('eq("owner_id"'));
          rows = rows.filter((r) => ((r as { owner_id: string }).owner_id === ME) === !!eq);
        }
        resolve({ data: rows, error: null });
      };
      return builder;
    },
    storage: {
      from: (bucket: string) => ({
        createSignedUrls: async (paths: string[]) => ({
          data: paths.map((p) => ({ path: p, signedUrl: `https://signed/${bucket}/${p}` })),
          error: null,
        }),
      }),
    },
  };
  return { client: client as unknown as LifeMapClient, calls };
}

describe('mappers', () => {
  it('maps rows to domain objects (nullable fields, coordinates)', () => {
    const e = toExperience(fixtures.experiences![1] as never, []);
    expect(e).toMatchObject({ id: 'e2', ownerId: FRIEND, date: '2026-09-02', placeName: 'Cotonou', description: 'Golden hour' });
    expect(e.coordinates).toBeUndefined();
    expect(toNotification(fixtures.notifications![0] as never).read).toBe(false);
  });

  it('builds clean write payloads from form values', () => {
    const payload = toExperienceWrite({
      title: '  Titre ',
      description: '   ',
      category: 'culture',
      date: '2026-01-02',
      placeName: ' Gand ',
      visibility: 'friends',
      media: [],
    });
    expect(payload).toEqual({
      title: 'Titre',
      description: null,
      category: 'culture',
      happened_on: '2026-01-02',
      place_name: 'Gand',
      latitude: null,
      longitude: null,
      visibility: 'friends',
    });
  });

  it('stores photos under owner/experience folders', () => {
    expect(mediaPath('u1', 'e1', 'm1')).toBe('u1/e1/m1.jpg');
    expect(isLocalMedia({ id: 'x', uri: 'file:///a.jpg' })).toBe(true);
    expect(isLocalMedia({ id: 'x', uri: 'https://s', storagePath: 'u/e/x.jpg' })).toBe(false);
  });
});

describe('fetchSnapshot', () => {
  it('assembles experiences, media links, profiles and social data', async () => {
    const { client, calls } = fakeClient();
    const snap = await fetchSnapshot(client, ME);

    expect(snap.myProfile.default_visibility).toBe('friends');
    expect(snap.experiences.map((e) => e.id).sort()).toEqual(['e1', 'e2']);
    const e1 = snap.experiences.find((e) => e.id === 'e1')!;
    expect(e1.media).toEqual([
      { id: 'm1', uri: `https://signed/experience-media/${ME}/e1/m1.jpg`, width: 800, height: 600, storagePath: `${ME}/e1/m1.jpg` },
    ]);
    expect(snap.profiles.find((p) => p.id === ME)?.avatarUrl).toBe(`https://signed/avatars/${ME}/avatar.jpg`);
    expect(snap.profiles.find((p) => p.id === FRIEND)?.avatarUrl).toBeUndefined();
    expect(snap.comments).toHaveLength(1);
    expect(snap.reactions).toEqual([{ experienceId: 'e2', userId: ME, kind: 'love' }]);

    // Shared experiences are bounded; media/reactions/comments only for loaded experiences.
    const shared = calls.find((c) => c.table === 'experiences' && c.ops.some((o) => o.startsWith('neq')))!;
    expect(shared.ops).toContain('limit(100)');
    const media = calls.find((c) => c.table === 'experience_media')!;
    expect(media.ops.some((o) => o.startsWith('in("experience_id"'))).toBe(true);
  });
});
