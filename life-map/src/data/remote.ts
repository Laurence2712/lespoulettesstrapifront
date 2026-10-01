import * as Crypto from 'expo-crypto';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import type { ExperienceFormValues } from '@/features/experiences/schema';
import type {
  AppNotification,
  Comment,
  Experience,
  ExperienceMedia,
  Friendship,
  Profile,
  Reaction,
  ReactionKind,
} from '@/features/experiences/types';
import type { ExperienceMediaRow, ProfileRow } from '@/lib/database.types';
import { AVATAR_BUCKET, MEDIA_BUCKET, type LifeMapClient } from '@/lib/supabase';

import {
  isLocalMedia,
  mediaPath,
  toComment,
  toExperience,
  toExperienceWrite,
  toFriendship,
  toMedia,
  toNotification,
  toProfile,
  toReaction,
} from './mappers';

/**
 * Server access. Every read is already filtered by Row Level Security: the client
 * can only ever receive rows the signed-in user is allowed to see.
 */

const SIGNED_URL_TTL = 60 * 60; // 1 h — refreshed on each sync
const FEED_LIMIT = 100;
const MAX_PHOTO_EDGE = 2048;

export type Snapshot = {
  meId: string;
  profiles: Profile[];
  experiences: Experience[];
  friendships: Friendship[];
  reactions: Reaction[];
  comments: Comment[];
  notifications: AppNotification[];
  myProfile: ProfileRow;
};

function check<T>(res: { data: T; error: { message: string } | null }): NonNullable<T> {
  if (res.error) throw new Error(res.error.message);
  return res.data as NonNullable<T>;
}

async function signedUrls(client: LifeMapClient, bucket: string, paths: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(paths)];
  if (unique.length === 0) return new Map();
  const { data, error } = await client.storage.from(bucket).createSignedUrls(unique, SIGNED_URL_TTL);
  if (error) throw new Error(error.message);
  const map = new Map<string, string>();
  for (const item of data ?? []) if (item.path && item.signedUrl) map.set(item.path, item.signedUrl);
  return map;
}

/** Everything the app displays, in one round of queries. */
export async function fetchSnapshot(client: LifeMapClient, meId: string): Promise<Snapshot> {
  const [mineRes, sharedRes, friendshipsRes, notificationsRes] = await Promise.all([
    client.from('experiences').select('*').eq('owner_id', meId).order('happened_on', { ascending: false }),
    // RLS returns only friends-only experiences of accepted friends + public ones.
    client
      .from('experiences')
      .select('*')
      .neq('owner_id', meId)
      .order('happened_on', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(FEED_LIMIT),
    client.from('friendships').select('*'),
    client.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),
  ]);
  const expRows = [...check(mineRes), ...check(sharedRes)];
  const friendships = check(friendshipsRes);
  const notifications = check(notificationsRes);
  const expIds = expRows.map((e) => e.id);

  const [mediaRes, reactionsRes, commentsRes] = expIds.length
    ? await Promise.all([
        client.from('experience_media').select('*').in('experience_id', expIds).order('position'),
        client.from('reactions').select('*').in('experience_id', expIds),
        client.from('comments').select('*').in('experience_id', expIds).order('created_at'),
      ])
    : [{ data: [], error: null }, { data: [], error: null }, { data: [], error: null }];
  const mediaRows = check(mediaRes) as ExperienceMediaRow[];
  const reactionRows = check(reactionsRes);
  const commentRows = check(commentsRes);

  // Every profile we need to display (authors, friends, notification actors).
  const profileIds = new Set<string>([meId]);
  expRows.forEach((e) => profileIds.add(e.owner_id));
  friendships.forEach((f) => (profileIds.add(f.requester_id), profileIds.add(f.addressee_id)));
  commentRows.forEach((c) => profileIds.add(c.author_id));
  notifications.forEach((n) => profileIds.add(n.actor_id));
  const profileRows = check(await client.from('profiles').select('*').in('id', [...profileIds]));

  const [mediaUrls, avatarUrls] = await Promise.all([
    signedUrls(client, MEDIA_BUCKET, mediaRows.map((m) => m.storage_path)),
    signedUrls(client, AVATAR_BUCKET, profileRows.flatMap((p) => (p.avatar_path ? [p.avatar_path] : []))),
  ]);

  const mediaByExperience = new Map<string, ExperienceMedia[]>();
  for (const m of mediaRows) {
    const list = mediaByExperience.get(m.experience_id) ?? [];
    list.push(toMedia(m, mediaUrls.get(m.storage_path)));
    mediaByExperience.set(m.experience_id, list);
  }

  const myProfile = profileRows.find((p) => p.id === meId);
  if (!myProfile) throw new Error('Profil introuvable.');

  return {
    meId,
    myProfile,
    profiles: profileRows.map((p) => toProfile(p, p.avatar_path ? avatarUrls.get(p.avatar_path) : undefined)),
    experiences: expRows.map((e) => toExperience(e, mediaByExperience.get(e.id) ?? [])),
    friendships: friendships.map(toFriendship),
    reactions: reactionRows.map(toReaction),
    comments: commentRows.map(toComment),
    notifications: notifications.map(toNotification),
  };
}

/**
 * Re-encodes a photo as JPEG: drops EXIF metadata (including GPS position) and
 * limits its size before upload. Returns the bytes to send.
 */
export async function preparePhoto(uri: string): Promise<{ body: ArrayBuffer; width: number; height: number }> {
  const context = ImageManipulator.manipulate(uri);
  context.resize({ width: MAX_PHOTO_EDGE });
  const image = await context.renderAsync();
  const result = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.82 });
  const body = await (await fetch(result.uri)).arrayBuffer();
  return { body, width: result.width, height: result.height };
}

async function uploadMedia(client: LifeMapClient, ownerId: string, experienceId: string, media: ExperienceMedia[], startPosition: number) {
  let position = startPosition;
  for (const m of media) {
    const id = m.id || Crypto.randomUUID();
    const path = mediaPath(ownerId, experienceId, id);
    const photo = await preparePhoto(m.uri);
    const up = await client.storage.from(MEDIA_BUCKET).upload(path, photo.body, { contentType: 'image/jpeg', upsert: false });
    if (up.error) throw new Error(up.error.message);
    check(
      await client.from('experience_media').insert({
        experience_id: experienceId,
        storage_path: path,
        width: photo.width,
        height: photo.height,
        position: position++,
      }),
    );
  }
}

export async function createExperience(client: LifeMapClient, ownerId: string, id: string, values: ExperienceFormValues) {
  check(await client.from('experiences').insert({ id, ...toExperienceWrite(values) }));
  await uploadMedia(client, ownerId, id, values.media.filter(isLocalMedia), 0);
}

export async function updateExperience(client: LifeMapClient, ownerId: string, before: Experience, values: ExperienceFormValues) {
  check(await client.from('experiences').update(toExperienceWrite(values)).eq('id', before.id));

  const keptPaths = new Set(values.media.flatMap((m) => (m.storagePath ? [m.storagePath] : [])));
  const removed = before.media.flatMap((m) => (m.storagePath && !keptPaths.has(m.storagePath) ? [m.storagePath] : []));
  if (removed.length) {
    check(await client.from('experience_media').delete().in('storage_path', removed));
    await client.storage.from(MEDIA_BUCKET).remove(removed);
  }
  await uploadMedia(client, ownerId, before.id, values.media.filter(isLocalMedia), keptPaths.size);
}

export async function deleteExperience(client: LifeMapClient, experience: Experience) {
  const paths = experience.media.flatMap((m) => (m.storagePath ? [m.storagePath] : []));
  check(await client.from('experiences').delete().eq('id', experience.id));
  if (paths.length) await client.storage.from(MEDIA_BUCKET).remove(paths);
}

export async function setReaction(client: LifeMapClient, meId: string, experienceId: string, kind: ReactionKind | null) {
  if (kind === null) {
    check(await client.from('reactions').delete().eq('experience_id', experienceId).eq('user_id', meId));
  } else {
    check(await client.from('reactions').upsert({ experience_id: experienceId, user_id: meId, kind }, { onConflict: 'experience_id,user_id' }));
  }
}

export async function addComment(client: LifeMapClient, id: string, experienceId: string, body: string) {
  // `id` is generated on the device so the optimistic comment and the stored one match.
  check(await client.from('comments').insert({ id, experience_id: experienceId, body }));
}

export async function sendFriendRequest(client: LifeMapClient, id: string, addresseeId: string) {
  check(await client.from('friendships').insert({ id, addressee_id: addresseeId }));
}

export async function acceptFriendRequest(client: LifeMapClient, friendshipId: string) {
  check(await client.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId));
}

export async function removeFriendship(client: LifeMapClient, friendshipId: string) {
  check(await client.from('friendships').delete().eq('id', friendshipId));
}

export async function markNotificationsRead(client: LifeMapClient) {
  check(await client.from('notifications').update({ read_at: new Date().toISOString() }).is('read_at', null));
}

async function withAvatars(client: LifeMapClient, rows: ProfileRow[]): Promise<Profile[]> {
  const urls = await signedUrls(client, AVATAR_BUCKET, rows.flatMap((p) => (p.avatar_path ? [p.avatar_path] : [])));
  return rows.map((p) => toProfile(p, p.avatar_path ? urls.get(p.avatar_path) : undefined));
}

/** Profiles matching a name or @username (RLS hides non-public profiles of strangers). */
export async function searchProfiles(client: LifeMapClient, query: string): Promise<Profile[]> {
  const q = query.trim().replace(/^@/, '').replace(/[%_,()*\\]/g, '');
  const req = client.from('profiles').select('*').order('username').limit(20);
  return withAvatars(client, check(await (q ? req.or(`username.ilike.%${q}%,display_name.ilike.%${q}%`) : req)));
}

/** Someone's profile page: their profile + the experiences RLS lets me see. */
export async function fetchUserPage(
  client: LifeMapClient,
  username: string,
): Promise<{ profile: Profile; experiences: Experience[] } | null> {
  const rows = check(await client.from('profiles').select('*').eq('username', username).limit(1));
  const row = rows[0];
  if (!row) return null;
  const expRows = check(
    await client.from('experiences').select('*').eq('owner_id', row.id).order('happened_on', { ascending: false }).limit(200),
  );
  const mediaRows = expRows.length
    ? (check(await client.from('experience_media').select('*').in('experience_id', expRows.map((e) => e.id)).order('position')) as ExperienceMediaRow[])
    : [];
  const urls = await signedUrls(client, MEDIA_BUCKET, mediaRows.map((m) => m.storage_path));
  const [profile] = await withAvatars(client, [row]);
  return {
    profile: profile!,
    experiences: expRows.map((e) =>
      toExperience(
        e,
        mediaRows.filter((m) => m.experience_id === e.id).map((m) => toMedia(m, urls.get(m.storage_path))),
      ),
    ),
  };
}

export async function updateProfile(
  client: LifeMapClient,
  meId: string,
  patch: { displayName: string; username: string; bio?: string; avatarUri?: string; onboarded?: boolean },
): Promise<{ avatarPath?: string }> {
  let avatarPath: string | undefined;
  if (patch.avatarUri && !/^https?:/.test(patch.avatarUri)) {
    const photo = await preparePhoto(patch.avatarUri);
    avatarPath = `${meId}/avatar-${Crypto.randomUUID()}.jpg`;
    const up = await client.storage.from(AVATAR_BUCKET).upload(avatarPath, photo.body, { contentType: 'image/jpeg' });
    if (up.error) throw new Error(up.error.message);
  }
  const res = await client
    .from('profiles')
    .update({
      display_name: patch.displayName,
      username: patch.username,
      bio: patch.bio || null,
      ...(avatarPath ? { avatar_path: avatarPath } : {}),
      ...(patch.onboarded ? { onboarded: true } : {}),
    })
    .eq('id', meId);
  if (res.error) {
    throw new Error(res.error.code === '23505' ? 'Cet identifiant est déjà pris.' : res.error.message);
  }
  return { avatarPath };
}

export async function updatePreferences(client: LifeMapClient, meId: string, patch: Partial<Pick<ProfileRow, 'default_visibility' | 'is_public'>>) {
  check(await client.from('profiles').update(patch).eq('id', meId));
}

/** RGPD: delete files through the Storage API, then the account (cascades to every table). */
export async function deleteAccount(client: LifeMapClient, meId: string, experiences: Experience[], avatarPath?: string | null) {
  const mediaPaths = experiences.filter((e) => e.ownerId === meId).flatMap((e) => e.media.flatMap((m) => (m.storagePath ? [m.storagePath] : [])));
  if (mediaPaths.length) await client.storage.from(MEDIA_BUCKET).remove(mediaPaths);
  const avatars = await client.storage.from(AVATAR_BUCKET).list(meId);
  const avatarPaths = (avatars.data ?? []).map((f) => `${meId}/${f.name}`);
  if (avatarPath && !avatarPaths.includes(avatarPath)) avatarPaths.push(avatarPath);
  if (avatarPaths.length) await client.storage.from(AVATAR_BUCKET).remove(avatarPaths);
  const { error } = await client.rpc('delete_my_account');
  if (error) throw new Error(error.message);
  await client.auth.signOut();
}
