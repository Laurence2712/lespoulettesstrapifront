import type {
  AppNotification,
  CategoryId,
  Comment,
  Experience,
  Friendship,
  Profile,
  Reaction,
  Visibility,
} from '@/features/experiences/types';
import { toISODate } from '@/features/experiences/schema';

/**
 * Demo dataset used when Supabase is not configured.
 * Dates are generated relative to "now" so stats and filters stay meaningful.
 */
export const DEMO_ME_ID = 'u-me';

export const demoProfiles: Profile[] = [
  { id: DEMO_ME_ID, username: 'camille', displayName: 'Camille Laurent', bio: 'Collectionneuse de lieux et de petits moments. Bruxelles ↔ partout.', avatarUrl: 'https://i.pravatar.cc/240?img=47', isPublic: true },
  { id: 'u-yao', username: 'yao.k', displayName: 'Yao Kossi', bio: 'Photographe à Cotonou. Les marchés, la lumière, les gens.', avatarUrl: 'https://i.pravatar.cc/240?img=12', isPublic: true },
  { id: 'u-ines', username: 'ines.m', displayName: 'Inès Martin', bio: 'Céramiste, randonneuse du dimanche.', avatarUrl: 'https://i.pravatar.cc/240?img=32', isPublic: true },
  { id: 'u-lucas', username: 'lucasvdb', displayName: 'Lucas Van den Berg', bio: 'J’apprends une langue par an.', avatarUrl: 'https://i.pravatar.cc/240?img=15', isPublic: true },
  { id: 'u-sofia', username: 'sofia.r', displayName: 'Sofia Rossi', bio: 'Carnets de voyage et cafés serrés.', avatarUrl: 'https://i.pravatar.cc/240?img=45', isPublic: true },
];

export const demoFriendships: Friendship[] = [
  { id: 'f1', requesterId: DEMO_ME_ID, addresseeId: 'u-yao', status: 'accepted', createdAt: '2025-11-02T10:00:00Z' },
  { id: 'f2', requesterId: 'u-ines', addresseeId: DEMO_ME_ID, status: 'accepted', createdAt: '2026-01-14T10:00:00Z' },
  { id: 'f3', requesterId: 'u-sofia', addresseeId: DEMO_ME_ID, status: 'pending', createdAt: '2026-09-28T10:00:00Z' },
  // u-lucas is not a friend: only his public experiences are visible.
];

type Seed = {
  owner: string;
  title: string;
  description?: string;
  category: CategoryId;
  daysAgo: number;
  place: string;
  lat?: number;
  lng?: number;
  visibility: Visibility;
  photos: number;
};

const seeds: Seed[] = [
  { owner: DEMO_ME_ID, title: 'Lever de soleil sur le Mont des Arts', description: 'Café chaud, ville encore endormie. Premier jour de la nouvelle routine.', category: 'discovery', daysAgo: 3, place: 'Mont des Arts, Bruxelles', lat: 50.8445, lng: 4.3571, visibility: 'friends', photos: 2 },
  { owner: DEMO_ME_ID, title: 'Atelier tissage wax', description: 'Trois heures pour un tout petit carré. Fière quand même.', category: 'creation', daysAgo: 9, place: 'Ixelles, Bruxelles', lat: 50.8333, lng: 4.3667, visibility: 'public', photos: 1 },
  { owner: DEMO_ME_ID, title: 'Rencontre avec Mamadou au marché', category: 'encounter', daysAgo: 16, place: 'Marché du Midi, Bruxelles', lat: 50.8366, lng: 4.3353, visibility: 'private', photos: 0 },
  { owner: DEMO_ME_ID, title: 'Lisbonne, enfin', description: 'Les azulejos, le tram 28, et ce pastel de nata à 8h du matin.', category: 'travel', daysAgo: 41, place: 'Alfama, Lisbonne', lat: 38.7139, lng: -9.1300, visibility: 'public', photos: 3 },
  { owner: DEMO_ME_ID, title: 'Fado dans une petite salle', category: 'culture', daysAgo: 40, place: 'Bairro Alto, Lisbonne', lat: 38.7131, lng: -9.1449, visibility: 'friends', photos: 1 },
  { owner: DEMO_ME_ID, title: 'Premier cours de portugais', category: 'learning', daysAgo: 55, place: 'En ligne', visibility: 'private', photos: 0 },
  { owner: DEMO_ME_ID, title: 'Marché Dantokpa', description: 'Le plus grand marché d’Afrique de l’Ouest. Les couleurs, le bruit, la vie.', category: 'travel', daysAgo: 96, place: 'Dantokpa, Cotonou', lat: 6.3703, lng: 2.4344, visibility: 'public', photos: 2 },
  { owner: DEMO_ME_ID, title: 'Route des Esclaves', category: 'culture', daysAgo: 94, place: 'Ouidah, Bénin', lat: 6.3176, lng: 2.0854, visibility: 'friends', photos: 1 },
  { owner: DEMO_ME_ID, title: 'Randonnée dans les Hautes Fagnes', category: 'discovery', daysAgo: 140, place: 'Hautes Fagnes, Belgique', lat: 50.5106, lng: 6.0756, visibility: 'public', photos: 2 },
  { owner: DEMO_ME_ID, title: 'Expo Magritte', category: 'culture', daysAgo: 175, place: 'Musée Magritte, Bruxelles', lat: 50.8427, lng: 4.3576, visibility: 'private', photos: 1 },

  { owner: 'u-yao', title: 'Golden hour à Fidjrossè', description: 'Les pêcheurs rentrent, la plage devient dorée.', category: 'discovery', daysAgo: 1, place: 'Plage de Fidjrossè, Cotonou', lat: 6.3561, lng: 2.3536, visibility: 'friends', photos: 2 },
  { owner: 'u-yao', title: 'Portrait d’une vendeuse de pagnes', category: 'encounter', daysAgo: 6, place: 'Dantokpa, Cotonou', lat: 6.3705, lng: 2.4350, visibility: 'public', photos: 1 },
  { owner: 'u-yao', title: 'Notes privées sur un projet', category: 'creation', daysAgo: 2, place: 'Cotonou', lat: 6.3654, lng: 2.4183, visibility: 'private', photos: 0 },
  { owner: 'u-ines', title: 'Première cuisson raku', description: 'Les craquelures sont arrivées exactement comme espéré.', category: 'creation', daysAgo: 4, place: 'Atelier Terre & Feu, Namur', lat: 50.4669, lng: 4.8675, visibility: 'friends', photos: 2 },
  { owner: 'u-ines', title: 'Crête des Aiguilles Rouges', category: 'travel', daysAgo: 22, place: 'Chamonix, France', lat: 45.9237, lng: 6.8694, visibility: 'public', photos: 2 },
  { owner: 'u-lucas', title: 'Cours de japonais — leçon 40', category: 'learning', daysAgo: 5, place: 'Gand, Belgique', lat: 51.0543, lng: 3.7174, visibility: 'public', photos: 1 },
  { owner: 'u-lucas', title: 'Soirée entre amis', category: 'encounter', daysAgo: 8, place: 'Gand, Belgique', lat: 51.0500, lng: 3.7300, visibility: 'friends', photos: 1 },
  { owner: 'u-sofia', title: 'Carnet de Kyoto', category: 'travel', daysAgo: 12, place: 'Fushimi Inari, Kyoto', lat: 34.9671, lng: 135.7727, visibility: 'public', photos: 2 },
];

function isoDaysAgo(now: Date, days: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return toISODate(d);
}

export function buildDemoExperiences(now: Date = new Date()): Experience[] {
  return seeds.map((s, i) => {
    const date = isoDaysAgo(now, s.daysAgo);
    const stamp = `${date}T18:00:00.000Z`;
    return {
      id: `demo-${i + 1}`,
      ownerId: s.owner,
      title: s.title,
      description: s.description,
      media: Array.from({ length: s.photos }, (_, p) => ({
        id: `demo-${i + 1}-m${p}`,
        uri: `https://picsum.photos/seed/lifemap-${i + 1}-${p}/900/700`,
        width: 900,
        height: 700,
      })),
      category: s.category,
      date,
      placeName: s.place,
      coordinates: s.lat !== undefined && s.lng !== undefined ? { latitude: s.lat, longitude: s.lng } : undefined,
      visibility: s.visibility,
      createdAt: stamp,
      updatedAt: stamp,
    };
  });
}

export const demoReactions: Reaction[] = [
  { experienceId: 'demo-1', userId: 'u-yao', kind: 'love' },
  { experienceId: 'demo-1', userId: 'u-ines', kind: 'inspired' },
  { experienceId: 'demo-4', userId: 'u-ines', kind: 'wow' },
  { experienceId: 'demo-11', userId: DEMO_ME_ID, kind: 'love' },
  { experienceId: 'demo-14', userId: 'u-yao', kind: 'inspired' },
];

export const demoComments: Comment[] = [
  { id: 'c1', experienceId: 'demo-1', authorId: 'u-ines', body: 'Ce spot au lever du jour, c’est magique.', createdAt: '2026-09-29T08:12:00Z' },
  { id: 'c2', experienceId: 'demo-11', authorId: DEMO_ME_ID, body: 'Cette lumière !! On y va ensemble la prochaine fois.', createdAt: '2026-09-30T19:40:00Z' },
  { id: 'c3', experienceId: 'demo-14', authorId: 'u-yao', body: 'Magnifique pièce, bravo Inès.', createdAt: '2026-09-27T12:00:00Z' },
];

export const demoNotifications: AppNotification[] = [
  { id: 'n1', recipientId: DEMO_ME_ID, actorId: 'u-sofia', type: 'friend_request', createdAt: '2026-09-28T10:00:00Z', read: false },
  { id: 'n2', recipientId: DEMO_ME_ID, actorId: 'u-yao', type: 'reaction', experienceId: 'demo-1', createdAt: '2026-09-29T07:30:00Z', read: false },
  { id: 'n3', recipientId: DEMO_ME_ID, actorId: 'u-ines', type: 'comment', experienceId: 'demo-1', createdAt: '2026-09-29T08:12:00Z', read: true },
];
