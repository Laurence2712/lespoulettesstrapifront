import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { toast } from '@/components/ui/Toast';
import {
  DEMO_ME_ID,
  buildDemoExperiences,
  demoComments,
  demoFriendships,
  demoNotifications,
  demoProfiles,
  demoReactions,
} from '@/data/demo';
import * as remote from '@/data/remote';
import { remoteUserId, useAuth } from '@/features/auth/authStore';
import { useSettings } from '@/features/settings/store';
import { isSupabaseConfigured } from '@/lib/env';
import { supabase, type LifeMapClient } from '@/lib/supabase';

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
 * Local data store and single source of truth for the screens.
 *
 * - DEMO MODE (no Supabase keys): seeded with demo data, persisted on the device.
 * - SUPABASE MODE: a cache of what the server returned (already filtered by RLS).
 *   Every action updates the cache immediately (optimistic UI), then is sent to the
 *   server; on failure the user is told and the cache is re-synced from the server.
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
  /** Rejects with a user-facing message (e.g. username taken) in Supabase mode. */
  updateMyProfile: (patch: { displayName: string; username: string; bio?: string; avatarUrl?: string; onboarded?: boolean }) => Promise<void>;
  /** Demo: removes my local data. Supabase: deletes files + account, then signs out. */
  deleteMyData: () => Promise<void>;
  resetDemo: () => void;
  hydrateFromServer: (snapshot: remote.Snapshot) => void;
  /** Adds/refreshes profiles and experiences fetched outside a full sync (search, profile pages). */
  mergeFromServer: (data: { profiles?: Profile[]; experiences?: Experience[] }) => void;
  clearLocal: () => void;
};

type DataSlice = Pick<DataState, 'meId' | 'profiles' | 'experiences' | 'friendships' | 'reactions' | 'comments' | 'notifications'>;

function seed(): DataSlice {
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

function empty(): DataSlice {
  return { meId: '', profiles: [], experiences: [], friendships: [], reactions: [], comments: [], notifications: [] };
}

const now = () => new Date().toISOString();

/** Sends a change to the server when signed in; no-op in demo mode. */
function pushRemote(label: string, op: (client: LifeMapClient, meId: string) => Promise<unknown>, resyncAfter = false) {
  const meId = remoteUserId();
  if (!supabase || !meId) return;
  op(supabase, meId)
    .then(() => {
      if (resyncAfter) void syncFromServer();
    })
    .catch((e: unknown) => {
      toast(`${label} : ${e instanceof Error ? e.message : 'échec de l’envoi'}`, 'error');
      void syncFromServer();
    });
}

export const useData = create<DataState>()(
  persist(
    (set, get) => ({
      ...(isSupabaseConfigured ? empty() : seed()),

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
        // Re-sync afterwards so uploaded photos get their server URLs.
        pushRemote('Enregistrement', (c, me) => remote.createExperience(c, me, experience.id, values), values.media.length > 0);
        return experience;
      },

      updateExperience: (id, values) => {
        const before = get().experiences.find((e) => e.id === id && e.ownerId === get().meId);
        if (!before) return;
        set((s) => ({
          experiences: s.experiences.map((e) =>
            e.id === id
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
        }));
        pushRemote('Modification', (c, me) => remote.updateExperience(c, me, before, values), true);
      },

      deleteExperience: (id) => {
        const target = get().experiences.find((e) => e.id === id && e.ownerId === get().meId);
        if (!target) return;
        set((s) => ({
          experiences: s.experiences.filter((e) => e.id !== id),
          reactions: s.reactions.filter((r) => r.experienceId !== id),
          comments: s.comments.filter((c) => c.experienceId !== id),
        }));
        pushRemote('Suppression', (c) => remote.deleteExperience(c, target));
      },

      toggleReaction: (experienceId, kind) => {
        const { meId, reactions } = get();
        const mine = reactions.find((r) => r.experienceId === experienceId && r.userId === meId);
        const others = reactions.filter((r) => !(r.experienceId === experienceId && r.userId === meId));
        const next = mine?.kind === kind ? null : kind;
        set({ reactions: next ? [...others, { experienceId, userId: meId, kind: next }] : others });
        pushRemote('Réaction', (c, me) => remote.setReaction(c, me, experienceId, next));
      },

      addComment: (experienceId, body) => {
        const text = body.trim().slice(0, 500);
        if (!text) return;
        const id = Crypto.randomUUID();
        set((s) => ({ comments: [...s.comments, { id, experienceId, authorId: s.meId, body: text, createdAt: now() }] }));
        pushRemote('Commentaire', (c) => remote.addComment(c, id, experienceId, text));
      },

      sendFriendRequest: (userId) => {
        const { meId, friendships } = get();
        const exists = friendships.some(
          (f) => (f.requesterId === meId && f.addresseeId === userId) || (f.requesterId === userId && f.addresseeId === meId),
        );
        if (exists || userId === meId) return;
        const id = Crypto.randomUUID();
        set({ friendships: [...friendships, { id, requesterId: meId, addresseeId: userId, status: 'pending', createdAt: now() }] });
        pushRemote('Demande d’amitié', (c) => remote.sendFriendRequest(c, id, userId), true);
      },

      acceptFriendRequest: (friendshipId) => {
        set((s) => ({
          friendships: s.friendships.map((f) =>
            f.id === friendshipId && f.addresseeId === s.meId ? { ...f, status: 'accepted' } : f,
          ),
        }));
        // Re-sync: accepting unlocks the friend's "friends-only" experiences.
        pushRemote('Acceptation', (c) => remote.acceptFriendRequest(c, friendshipId), true);
      },

      removeFriendship: (friendshipId) => {
        set((s) => ({
          friendships: s.friendships.filter(
            (f) => !(f.id === friendshipId && (f.requesterId === s.meId || f.addresseeId === s.meId)),
          ),
        }));
        pushRemote('Suppression d’ami', (c) => remote.removeFriendship(c, friendshipId), true);
      },

      markNotificationsRead: () => {
        if (!get().notifications.some((n) => n.recipientId === get().meId && !n.read)) return;
        set((s) => ({ notifications: s.notifications.map((n) => (n.recipientId === s.meId ? { ...n, read: true } : n)) }));
        pushRemote('Notifications', (c) => remote.markNotificationsRead(c));
      },

      updateMyProfile: async ({ onboarded, ...patch }) => {
        const meId = remoteUserId();
        if (supabase && meId) {
          await remote.updateProfile(supabase, meId, { ...patch, avatarUri: patch.avatarUrl, onboarded });
          await syncFromServer();
          return;
        }
        set((s) => ({ profiles: s.profiles.map((p) => (p.id === s.meId ? { ...p, ...patch } : p)) }));
      },

      deleteMyData: async () => {
        const meId = remoteUserId();
        if (supabase && meId) {
          await remote.deleteAccount(supabase, meId, get().experiences, useAuth.getState().myProfile?.avatar_path);
          return; // sign-out wipes the local cache
        }
        set((s) => ({
          experiences: s.experiences.filter((e) => e.ownerId !== s.meId),
          reactions: s.reactions.filter((r) => r.userId !== s.meId),
          comments: s.comments.filter((c) => c.authorId !== s.meId),
          friendships: s.friendships.filter((f) => f.requesterId !== s.meId && f.addresseeId !== s.meId),
          notifications: [],
        }));
      },

      resetDemo: () => set(seed()),

      hydrateFromServer: (snapshot) =>
        set({
          meId: snapshot.meId,
          profiles: snapshot.profiles,
          experiences: snapshot.experiences,
          friendships: snapshot.friendships,
          reactions: snapshot.reactions,
          comments: snapshot.comments,
          notifications: snapshot.notifications,
        }),

      mergeFromServer: ({ profiles = [], experiences = [] }) =>
        set((s) => {
          const pIds = new Set(profiles.map((p) => p.id));
          const eIds = new Set(experiences.map((e) => e.id));
          return {
            profiles: [...s.profiles.filter((p) => !pIds.has(p.id)), ...profiles],
            experiences: [...s.experiences.filter((e) => !eIds.has(e.id)), ...experiences],
          };
        }),

      clearLocal: () => set(empty()),
    }),
    {
      name: 'lifemap.demo-data.v1',
      storage: createJSONStorage(() => AsyncStorage),
      // Only demo data is kept on the device. Account data is never persisted locally,
      // so nothing remains on the phone after signing out.
      partialize: (s): Partial<DataSlice> =>
        isSupabaseConfigured
          ? {}
          : {
              meId: s.meId,
              profiles: s.profiles,
              experiences: s.experiences,
              friendships: s.friendships,
              reactions: s.reactions,
              comments: s.comments,
              notifications: s.notifications,
            },
    },
  ),
);

let inflight: Promise<void> | null = null;

/** Pulls everything visible to the signed-in user into the cache. No-op in demo mode. */
export function syncFromServer(): Promise<void> {
  const client = supabase;
  const userId = remoteUserId();
  if (!client || !userId) return Promise.resolve();
  if (inflight) return inflight;

  useAuth.setState((s) => ({ sync: s.sync === 'ready' ? 'ready' : 'syncing', syncError: null }));
  inflight = remote
    .fetchSnapshot(client, userId)
    .then((snapshot) => {
      useData.getState().hydrateFromServer(snapshot);
      useSettings.getState().setDefaultVisibility(snapshot.myProfile.default_visibility);
      useAuth.setState({ myProfile: snapshot.myProfile, sync: 'ready' });
    })
    .catch((e: unknown) => {
      useAuth.setState((s) => ({
        sync: s.sync === 'ready' ? 'ready' : 'error',
        syncError: e instanceof Error ? e.message : 'Connexion impossible.',
      }));
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/* ---------- Read hooks (the public API screens use) ---------- */

const PLACEHOLDER_PROFILE: Profile = { id: '', username: '', displayName: '', isPublic: true };

export function useMe(): Profile {
  const meId = useData((s) => s.meId);
  const profiles = useData((s) => s.profiles);
  // The placeholder only shows for a split second while the account is loading.
  return profiles.find((p) => p.id === meId) ?? PLACEHOLDER_PROFILE;
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
