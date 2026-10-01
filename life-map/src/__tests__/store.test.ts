import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import { DEMO_ME_ID } from '@/data/demo';
import { useCommunityExperiences, useData, useFeed, useVisibleExperiencesOf } from '@/features/experiences/store';

const base = {
  title: 'Nouvelle expérience',
  category: 'discovery' as const,
  date: '2026-09-01',
  placeName: 'Namur',
  visibility: 'private' as const,
  media: [],
};

beforeEach(() => {
  useData.getState().resetDemo();
});

describe('demo data store', () => {
  it('adds an experience owned by the current user, trimmed', () => {
    const before = useData.getState().experiences.length;
    const id = useData.getState().addExperience({ ...base, title: '  Espace  ', description: '   ' }).id;
    const created = useData.getState().experiences.find((e) => e.id === id)!;
    expect(useData.getState().experiences).toHaveLength(before + 1);
    expect(created.ownerId).toBe(DEMO_ME_ID);
    expect(created.title).toBe('Espace');
    expect(created.description).toBeUndefined();
  });

  it('never puts private experiences in the feed or community views', async () => {
    const { result: feed } = await renderHook(() => useFeed());
    const { result: community } = await renderHook(() => useCommunityExperiences());
    expect(feed.current.length).toBeGreaterThan(0);
    expect(feed.current.every((e) => e.visibility !== 'private')).toBe(true);
    expect(community.current.every((e) => e.visibility !== 'private' && e.ownerId !== DEMO_ME_ID)).toBe(true);
  });

  it('shows a non-friend only their public experiences', async () => {
    const { result } = await renderHook(() => useVisibleExperiencesOf('u-lucas'));
    expect(result.current.length).toBeGreaterThan(0);
    expect(result.current.every((e) => e.visibility === 'public')).toBe(true);
  });

  it('only lets the owner update or delete', () => {
    const others = useData.getState().experiences.find((e) => e.ownerId !== DEMO_ME_ID)!;
    useData.getState().updateExperience(others.id, { ...base, title: 'Piraté' });
    useData.getState().deleteExperience(others.id);
    const after = useData.getState().experiences.find((e) => e.id === others.id);
    expect(after?.title).toBe(others.title);
  });

  it('toggles a single reaction per user', () => {
    const target = 'demo-11';
    const mine = () => useData.getState().reactions.filter((r) => r.experienceId === target && r.userId === DEMO_ME_ID);
    useData.getState().toggleReaction(target, 'wow');
    expect(mine().map((r) => r.kind)).toEqual(['wow']);
    useData.getState().toggleReaction(target, 'wow');
    expect(mine()).toHaveLength(0);
  });

  it('accepts an incoming friend request, which opens friends-only content', () => {
    const request = useData.getState().friendships.find((f) => f.requesterId === 'u-sofia')!;
    useData.getState().acceptFriendRequest(request.id);
    expect(useData.getState().friendships.find((f) => f.id === request.id)?.status).toBe('accepted');
  });

  it('deletes all of my data on request', () => {
    useData.getState().deleteMyData();
    const s = useData.getState();
    expect(s.experiences.some((e) => e.ownerId === DEMO_ME_ID)).toBe(false);
    expect(s.comments.some((c) => c.authorId === DEMO_ME_ID)).toBe(false);
    expect(s.friendships.some((f) => f.requesterId === DEMO_ME_ID || f.addresseeId === DEMO_ME_ID)).toBe(false);
  });
});
