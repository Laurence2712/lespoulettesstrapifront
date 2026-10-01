export const CATEGORY_IDS = [
  'travel',
  'discovery',
  'culture',
  'encounter',
  'creation',
  'learning',
  'other',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const VISIBILITIES = ['private', 'friends', 'public'] as const;
export type Visibility = (typeof VISIBILITIES)[number];

export type Coordinates = { latitude: number; longitude: number };

export type ExperienceMedia = {
  id: string;
  uri: string;
  width?: number;
  height?: number;
};

export type Experience = {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  media: ExperienceMedia[];
  category: CategoryId;
  /** Day the experience happened, ISO date `YYYY-MM-DD`. */
  date: string;
  placeName: string;
  coordinates?: Coordinates;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  /** Profile itself discoverable in search; experiences keep their own visibility. */
  isPublic: boolean;
};

export type FriendshipStatus = 'pending' | 'accepted';

export type Friendship = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
};

export const REACTION_KINDS = ['love', 'wow', 'inspired'] as const;
export type ReactionKind = (typeof REACTION_KINDS)[number];

export type Reaction = {
  experienceId: string;
  userId: string;
  kind: ReactionKind;
};

export type Comment = {
  id: string;
  experienceId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type AppNotification = {
  id: string;
  recipientId: string;
  actorId: string;
  type: 'friend_request' | 'friend_accepted' | 'reaction' | 'comment';
  experienceId?: string;
  createdAt: string;
  read: boolean;
};
