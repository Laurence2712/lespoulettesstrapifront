/**
 * Types of the Supabase database, mirroring supabase/migrations/*.sql.
 * Once a Supabase project exists, regenerate with:
 *   npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
 */
export type Visibility = 'private' | 'friends' | 'public';
export type ExperienceCategory = 'travel' | 'discovery' | 'culture' | 'encounter' | 'creation' | 'learning' | 'other';
export type FriendshipStatus = 'pending' | 'accepted';
export type ReactionKind = 'love' | 'wow' | 'inspired';
export type NotificationType = 'friend_request' | 'friend_accepted' | 'reaction' | 'comment';

type Table<Row, Required extends keyof Row, Optional extends keyof Row = never, Updatable extends keyof Row = keyof Row> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Pick<Row, Optional>>;
  Update: Partial<Pick<Row, Updatable>>;
  Relationships: [];
};

export type ProfileRow = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_path: string | null;
  is_public: boolean;
  default_visibility: Visibility;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
};

export type ExperienceRow = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  category: ExperienceCategory;
  happened_on: string;
  place_name: string;
  latitude: number | null;
  longitude: number | null;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
};

export type ExperienceMediaRow = {
  id: string;
  experience_id: string;
  owner_id: string;
  storage_path: string;
  width: number | null;
  height: number | null;
  position: number;
  created_at: string;
};

export type FriendshipRow = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
  created_at: string;
  responded_at: string | null;
};

export type ReactionRow = { experience_id: string; user_id: string; kind: ReactionKind; created_at: string };

export type CommentRow = { id: string; experience_id: string; author_id: string; body: string; created_at: string };

export type NotificationRow = {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: NotificationType;
  experience_id: string | null;
  created_at: string;
  read_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        ProfileRow,
        never,
        never,
        'username' | 'display_name' | 'bio' | 'avatar_path' | 'is_public' | 'default_visibility' | 'onboarded'
      >;
      experiences: Table<
        ExperienceRow,
        'title' | 'category' | 'happened_on' | 'place_name',
        'id' | 'owner_id' | 'description' | 'latitude' | 'longitude' | 'visibility',
        'title' | 'description' | 'category' | 'happened_on' | 'place_name' | 'latitude' | 'longitude' | 'visibility'
      >;
      experience_media: Table<
        ExperienceMediaRow,
        'experience_id' | 'storage_path',
        'id' | 'owner_id' | 'width' | 'height' | 'position',
        never
      >;
      friendships: Table<FriendshipRow, 'addressee_id', 'id' | 'requester_id' | 'status', 'status'>;
      reactions: Table<ReactionRow, 'experience_id' | 'kind', 'user_id', 'kind'>;
      comments: Table<CommentRow, 'experience_id' | 'body', 'id' | 'author_id', never>;
      notifications: Table<NotificationRow, never, never, 'read_at'>;
    };
    Views: { [_ in never]: never };
    Functions: {
      are_friends: { Args: { a: string; b: string }; Returns: boolean };
      can_view_experience: { Args: { exp_id: string }; Returns: boolean };
      delete_my_account: { Args: Record<string, never>; Returns: undefined };
    };
    Enums: {
      visibility: Visibility;
      experience_category: ExperienceCategory;
      friendship_status: FriendshipStatus;
      reaction_kind: ReactionKind;
      notification_type: NotificationType;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
