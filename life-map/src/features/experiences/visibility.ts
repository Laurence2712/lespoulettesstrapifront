import type { Experience, Friendship } from './types';

/**
 * Client-side mirror of the database access rules (RLS).
 * In demo mode this is the only gate; with Supabase the database enforces the same
 * rules and this function is only a second line of defence — never the only one.
 */
export function areFriends(a: string, b: string, friendships: readonly Friendship[]): boolean {
  if (a === b) return false;
  return friendships.some(
    (f) =>
      f.status === 'accepted' &&
      ((f.requesterId === a && f.addresseeId === b) || (f.requesterId === b && f.addresseeId === a)),
  );
}

export function canView(viewerId: string | null, experience: Experience, friendships: readonly Friendship[]): boolean {
  if (viewerId !== null && experience.ownerId === viewerId) return true;
  switch (experience.visibility) {
    case 'public':
      return true;
    case 'friends':
      return viewerId !== null && areFriends(viewerId, experience.ownerId, friendships);
    case 'private':
      return false;
  }
}

export function filterVisible(
  viewerId: string | null,
  experiences: readonly Experience[],
  friendships: readonly Friendship[],
): Experience[] {
  return experiences.filter((e) => canView(viewerId, e, friendships));
}
