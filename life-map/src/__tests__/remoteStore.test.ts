import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

/**
 * Store behaviour in SUPABASE MODE: optimistic update first, then the server call;
 * on failure the user is warned and the cache is re-synced from the server.
 */

const mockRemote = {
  fetchSnapshot: jest.fn<() => Promise<unknown>>(),
  createExperience: jest.fn<() => Promise<void>>(),
  setReaction: jest.fn<() => Promise<void>>(),
  addComment: jest.fn<() => Promise<void>>(),
  deleteExperience: jest.fn<() => Promise<void>>(),
  acceptFriendRequest: jest.fn<() => Promise<void>>(),
};
const mockToast = jest.fn();

jest.mock('@/lib/env', () => ({ env: { supabaseUrl: 'https://x.supabase.co', supabaseAnonKey: 'anon' }, isSupabaseConfigured: true }));
jest.mock('@/lib/supabase', () => ({ supabase: { fake: true }, MEDIA_BUCKET: 'experience-media', AVATAR_BUCKET: 'avatars' }));
jest.mock('@/data/remote', () => mockRemote);
jest.mock('@/components/ui/Toast', () => ({ toast: (...args: unknown[]) => mockToast(...args) }));

/* eslint-disable @typescript-eslint/no-require-imports */
const { useData } = require('@/features/experiences/store') as typeof import('@/features/experiences/store');
const { useAuth } = require('@/features/auth/authStore') as typeof import('@/features/auth/authStore');
/* eslint-enable @typescript-eslint/no-require-imports */

const ME = 'me-uuid';
const flush = () => new Promise((r) => setTimeout(r, 0));

const snapshot = {
  meId: ME,
  myProfile: { id: ME, default_visibility: 'private', onboarded: true },
  profiles: [{ id: ME, username: 'me', displayName: 'Moi', isPublic: true }],
  experiences: [],
  friendships: [{ id: 'f1', requesterId: 'other', addresseeId: ME, status: 'pending', createdAt: 't' }],
  reactions: [],
  comments: [],
  notifications: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockRemote.fetchSnapshot.mockResolvedValue(snapshot);
  useAuth.setState({ session: { user: { id: ME } } as never, initialized: true });
  useData.getState().hydrateFromServer(snapshot as never);
});

afterEach(() => useData.getState().clearLocal());

describe('store in Supabase mode', () => {
  it('starts empty: demo data is never shown to a real account', () => {
    useData.getState().clearLocal();
    expect(useData.getState().experiences).toEqual([]);
  });

  it('applies a reaction immediately and sends it to the server', async () => {
    mockRemote.setReaction.mockResolvedValue(undefined);
    useData.getState().toggleReaction('e1', 'love');
    expect(useData.getState().reactions).toEqual([{ experienceId: 'e1', userId: ME, kind: 'love' }]);
    await flush();
    expect(mockRemote.setReaction).toHaveBeenCalledWith(expect.anything(), ME, 'e1', 'love');
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('warns and re-syncs from the server when a write fails', async () => {
    mockRemote.createExperience.mockRejectedValue(new Error('réseau indisponible'));
    const created = useData.getState().addExperience({
      title: 'Hors ligne',
      category: 'other',
      date: '2026-09-01',
      placeName: 'Nulle part',
      visibility: 'private',
      media: [],
    });
    expect(useData.getState().experiences.map((e) => e.id)).toContain(created.id); // optimistic
    await flush();
    await flush();
    expect(mockToast).toHaveBeenCalledWith(expect.stringContaining('réseau indisponible'), 'error');
    expect(mockRemote.fetchSnapshot).toHaveBeenCalled();
    // The server snapshot (without the failed item) replaced the optimistic state.
    expect(useData.getState().experiences.map((e) => e.id)).not.toContain(created.id);
  });

  it('accepting a friend re-syncs to unlock their friends-only experiences', async () => {
    mockRemote.acceptFriendRequest.mockResolvedValue(undefined);
    useData.getState().acceptFriendRequest('f1');
    expect(useData.getState().friendships[0]?.status).toBe('accepted');
    await flush();
    await flush();
    expect(mockRemote.acceptFriendRequest).toHaveBeenCalledWith(expect.anything(), 'f1');
    expect(mockRemote.fetchSnapshot).toHaveBeenCalled();
  });

  it('does not call the server when signed out', async () => {
    useAuth.setState({ session: null });
    useData.getState().addComment('e1', 'coucou');
    await flush();
    expect(mockRemote.addComment).not.toHaveBeenCalled();
  });
});
