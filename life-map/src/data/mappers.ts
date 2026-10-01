import type { ExperienceFormValues } from '@/features/experiences/schema';
import type {
  AppNotification,
  Comment,
  Experience,
  ExperienceMedia,
  Friendship,
  Profile,
  Reaction,
} from '@/features/experiences/types';
import type {
  CommentRow,
  Database,
  ExperienceMediaRow,
  ExperienceRow,
  FriendshipRow,
  NotificationRow,
  ProfileRow,
  ReactionRow,
} from '@/lib/database.types';

/** Database rows → app domain objects. Pure functions, unit-tested. */

export function toProfile(row: ProfileRow, avatarUrl?: string): Profile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio ?? undefined,
    avatarUrl,
    isPublic: row.is_public,
  };
}

export function toExperience(row: ExperienceRow, media: ExperienceMedia[]): Experience {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description ?? undefined,
    media,
    category: row.category,
    date: row.happened_on,
    placeName: row.place_name,
    coordinates:
      row.latitude !== null && row.longitude !== null ? { latitude: row.latitude, longitude: row.longitude } : undefined,
    visibility: row.visibility,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toMedia(row: ExperienceMediaRow, signedUrl: string | undefined): ExperienceMedia {
  return {
    id: row.id,
    uri: signedUrl ?? '',
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    storagePath: row.storage_path,
  };
}

export function toFriendship(row: FriendshipRow): Friendship {
  return { id: row.id, requesterId: row.requester_id, addresseeId: row.addressee_id, status: row.status, createdAt: row.created_at };
}

export function toReaction(row: ReactionRow): Reaction {
  return { experienceId: row.experience_id, userId: row.user_id, kind: row.kind };
}

export function toComment(row: CommentRow): Comment {
  return { id: row.id, experienceId: row.experience_id, authorId: row.author_id, body: row.body, createdAt: row.created_at };
}

export function toNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    recipientId: row.recipient_id,
    actorId: row.actor_id,
    type: row.type,
    experienceId: row.experience_id ?? undefined,
    createdAt: row.created_at,
    read: row.read_at !== null,
  };
}

/** Form values → experiences row (insert/update). Owner is set by the database from the JWT. */
export function toExperienceWrite(
  values: ExperienceFormValues,
): Database['public']['Tables']['experiences']['Update'] & Pick<ExperienceRow, 'title' | 'category' | 'happened_on' | 'place_name'> {
  return {
    title: values.title.trim(),
    description: values.description?.trim() || null,
    category: values.category,
    happened_on: values.date,
    place_name: values.placeName.trim(),
    latitude: values.coordinates?.latitude ?? null,
    longitude: values.coordinates?.longitude ?? null,
    visibility: values.visibility,
  };
}

/** A media item picked on the device but not uploaded yet. */
export function isLocalMedia(m: ExperienceMedia): boolean {
  return !m.storagePath;
}

export function mediaPath(ownerId: string, experienceId: string, mediaId: string): string {
  return `${ownerId}/${experienceId}/${mediaId}.jpg`;
}
