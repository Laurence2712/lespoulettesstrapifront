import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  DEMO_ME_ID,
  buildDemoExperiences,
  demoComments,
  demoFriendships,
  demoNotifications,
  demoProfiles,
  demoReactions,
} from '@/data/demo';

import type { ExperienceFormValues } from './schema';
import type {
  AppNotification,
  Comment,
  Experience,
  Friendship,
  Profile,
  Reaction,
  ReactionKind,
} from './types';
import { areFriends, filterVisible } from './visibility';
import { sortByDateDesc } from './filters';

/**
 * Local data store used in DEMO MODE (no Supabase configured).
 * Everything lives on the device (AsyncStorage). Phase 3 replaces these actions
 * with Supabase calls behind the same hooks, so screens won't need to change.
 */
type DataState = {
  meId: string;
  profiles: Profile[];
  experiences: Experience[];
  friendships: Friendship[];
  reactions: Reaction[];
  comments: Comment[];
  notifications: AppNotification[];

  addExperience: (values: ExperienceFormValues) => Experience;
  updateExperience: (id: string, values: ExperienceFormValues) => void;
  deleteExperience: (id: string) => void;
  toggleReaction: (experienceId: string, kind: ReactionKind) => void;
  addComment: (experienceId: string, body: string) => void;
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (friendshipId: string) => void;
  removeFriendship: (friendshipId: string) => void;
  markNotificationsRead: () => void;
  updateMyProfile: (patch: Partial<Pick<Profile, 'displayName' | 'username' | 'bio' | 'avatarUrl'>>) => void;
  deleteMyData: () => void;
  resetDemo: () => void;
};

function seed() {
  return {
    meId: DEMO_ME_ID,
    profiles: demoProfiles,
    experiences: buildDemoExperiences(),
    friendships: demoFriendships,
    reactions: demoReactions,
    comments: demoComments,
    notifications: demoNotifications,
  };
}

const now = () => new Date().toISOString();

export const useData = create<DataState>()(
  persist(
    (set, get) => ({
      ...seed(),

      addExperience: (values) => {
        const stamp = now();
        const experience: Experience = {
          id: Crypto.randomUUID(),
          ownerId: get().meId,
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
          media: values.media,
          category: values.category,
          date: values.date,
          placeName: values.placeName.trim(),
          coordinates: values.coordinates,
          visibility: values.visibility,
          createdAt: stamp,
          updatedAt: stamp,
        };
        set((s) => ({ experiences: [experience, ...s.experiences] }));
        return experience;
      },

      updateExperience: (id, values) =>
        set((s) => ({
          experiences: s.experiences.map((e) =>
            e.id === id && e.ownerId === s.meId
              ? {
                  ...e,
                  ...values,
                  title: values.title.trim(),
                  description: values.description?.trim() || undefined,
                  placeName: values.placeName.trim(),
                  updatedAt: now(),
                }
              : e,
          ),
        })),

      deleteExperience: (id) =>
        set((s) => ({
          experiences: s.experiences.filter((e) => !(e.id === id && e.ownerId === s.meId)),
          reactions: s.reactions.filter((r) => r.experienceId !== id),
          comments: s.comments.filter((c) => c.experienceId !== id),
        })),

      toggleReaction: (experienceId, kind) =>
        set((s) => {
          const mine = s.reactions.find((r) => r.experienceId === experienceId && r.userId === s.meId);
          const others = s.reactions.filter((r) => !(r.experienceId === experienceId && r.userId === s.meId));
          if (mine?.kind === kind) return { reactions: others };
          return { reactions: [...others, { experienceId, userId: s.meId, kind }] };
        }),

      addComment: (experienceId, body) => {
        const text = body.trim();
        if (!text) return;
        set((s) => ({
          comments: [...s.comments, { id: Crypto.randomUUID(), experienceId, authorId: s.meId, body: text.slice(0, 500), createdAt: now() }],
        }));
      },

      sendFriendRequest: (userId) =>
        set((s) => {
          const exists = s.friendships.some(
            (f) => (f.requesterId === s.meId && f.addresseeId === userId) || (f.requesterId === userId && f.addresseeId === s.meId),
          );
          if (exists || userId === s.meId) return {};
          return {
            friendships: [
              ...s.friendships,
              { id: Crypto.randomUUID(), requesterId: s.meId, addresseeId: userId, status: 'pending', createdAt: now() },
            ],
          };
        }),

      acceptFriendRequest: (friendshipId) =>
        set((s) => ({
          friendships: s.friendships.map((f) =>
            f.id === friendshipId && f.addresseeId === s.meId ? { ...f, status: 'accepted' } : f,
          ),
        })),

      removeFriendship: (friendshipId) =>
        set((s) => ({
          friendships: s.friendships.filter(
            (f) => !(f.id === friendshipId && (f.requesterId === s.meId || f.addresseeId === s.meId)),
          ),
        })),

      markNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.recipientId === s.meId ? { ...n, read: true } : n)) })),

      updateMyProfile: (patch) =>
        set((s) => ({ profiles: s.profiles.map((p) => (p.id === s.meId ? { ...p, ...patch } : p)) })),

      deleteMyData: () =>
        set((s) => ({
          experiences: s.experiences.filter((e) => e.ownerId !== s.meId),
          reactions: s.reactions.filter((r) => r.userId !== s.meId),
          comments: s.comments.filter((c) => c.authorId !== s.meId),
          friendships: s.friendships.filter((f) => f.requesterId !== s.meId && f.addresseeId !== s.meId),
          notifications: [],
        })),

      resetDemo: () => set(seed()),
    }),
    {
      name: 'lifemap.demo-data.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ meId, profiles, experiences, friendships, reactions, comments, notifications }) => ({
        meId,
        profiles,
        experiences,
        friendships,
        reactions,
        comments,
        notifications,
      }),
    },
  ),
);

/* ---------- Read hooks (the public API screens use) ---------- */

export function useMe(): Profile {
  const meId = useData((s) => s.meId);
  const profiles = useData((s) => s.profiles);
  return profiles.find((p) => p.id === meId)!;
}

export function useProfile(id: string | undefined): Profile | undefined {
  const profiles = useData((s) => s.profiles);
  return profiles.find((p) => p.id === id);
}

export function useProfileByUsername(username: string | undefined): Profile | undefined {
  const profiles = useData((s) => s.profiles);
  return profiles.find((p) => p.username === username);
}

export function useMyExperiences(): Experience[] {
  const meId = useData((s) => s.meId);
  const experiences = useData((s) => s.experiences);
  return useMemo(() => sortByDateDesc(experiences.filter((e) => e.ownerId === meId)), [experiences, meId]);
}

/** Experiences of `ownerId` that the current user is allowed to see. */
export function useVisibleExperiencesOf(ownerId: string | undefined): Experience[] {
  const meId = useData((s) => s.meId);
  const experiences = useData((s) => s.experiences);
  const friendships = useData((s) => s.friendships);
  return useMemo(
    () => sortByDateDesc(filterVisible(meId, experiences.filter((e) => e.ownerId === ownerId), friendships)),
    [experiences, friendships, meId, ownerId],
  );
}

/** Feed: friends' experiences visible to me (never private ones), newest first. */
export function useFeed(): Experience[] {
  const meId = useData((s) => s.meId);
  const experiences = useData((s) => s.experiences);
  const friendships = useData((s) => s.friendships);
  return useMemo(() => {
    const friendsOnly = experiences.filter((e) => areFriends(meId, e.ownerId, friendships));
    return sortByDateDesc(filterVisible(meId, friendsOnly, friendships));
  }, [experiences, friendships, meId]);
}

/** Public experiences from people who are not friends (Explore → "Communauté"). */
export function useCommunityExperiences(): Experience[] {
  const meId = useData((s) => s.meId);
  const experiences = useData((s) => s.experiences);
  const friendships = useData((s) => s.friendships);
  return useMemo(
    () => sortByDateDesc(filterVisible(meId, experiences.filter((e) => e.ownerId !== meId), friendships)),
    [experiences, friendships, meId],
  );
}

export function useExperience(id: string | undefined): Experience | undefined {
  const meId = useData((s) => s.meId);
  const experiences = useData((s) => s.experiences);
  const friendships = useData((s) => s.friendships);
  return useMemo(() => {
    const e = experiences.find((x) => x.id === id);
    return e && filterVisible(meId, [e], friendships).length ? e : undefined;
  }, [experiences, friendships, id, meId]);
}

export type FriendRelation =
  | { kind: 'self' }
  | { kind: 'none' }
  | { kind: 'friends'; friendshipId: string }
  | { kind: 'outgoing'; friendshipId: string }
  | { kind: 'incoming'; friendshipId: string };

export function useRelation(userId: string | undefined): FriendRelation {
  const meId = useData((s) => s.meId);
  const friendships = useData((s) => s.friendships);
  return useMemo(() => {
    if (!userId || userId === meId) return { kind: 'self' };
    const f = friendships.find(
      (x) => (x.requesterId === meId && x.addresseeId === userId) || (x.requesterId === userId && x.addresseeId === meId),
    );
    if (!f) return { kind: 'none' };
    if (f.status === 'accepted') return { kind: 'friends', friendshipId: f.id };
    return f.requesterId === meId ? { kind: 'outgoing', friendshipId: f.id } : { kind: 'incoming', friendshipId: f.id };
  }, [friendships, meId, userId]);
}
