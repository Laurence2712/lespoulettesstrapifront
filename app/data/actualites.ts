// ============================================================
// DONNÉES STATIQUES — ACTUALITÉS
// ============================================================
// Ajoutez vos articles ici.
// Les images doivent être placées dans /public/images/actualites/
// ============================================================

export interface Actualite {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  date?: string;
}

export const actualites: Actualite[] = [
  // ── EXEMPLE 1 ──────────────────────────────────────────────
  {
    id: 1,
    title: 'Nouvelle collection printemps 2025',
    content: `Nous sommes ravies de vous présenter notre nouvelle collection printemps 2025 ! Inspirée des marchés colorés de Cotonou, cette collection met à l'honneur les motifs géométriques et les tons chauds du wax africain.

Chaque pièce est confectionnée à la main dans notre atelier au Bénin, avec un soin particulier apporté aux finitions. Vous retrouverez de nouvelles trousses, des tote bags et des housses aux couleurs vivifiantes.

La collection est disponible dès maintenant dans notre boutique en ligne !`,
    image_url: '/images/actualites/collection-printemps-2025.jpg',
    date: '2025-03-15',
  },

  // ── EXEMPLE 2 ──────────────────────────────────────────────
  {
    id: 2,
    title: 'Les Poulettes au salon créatif de Bruxelles',
    content: `Les Poulettes seront présentes au Salon Créatif de Bruxelles les 12 et 13 avril 2025 !

Venez nous rendre visite pour découvrir nos créations en vrai, poser vos questions sur nos matières et nos techniques, et même assister à une petite démonstration de confection.

C'est l'occasion de récupérer vos commandes en main propre ou de repartir avec un petit cadeau coup de cœur. On vous attend avec impatience !`,
    image_url: '/images/actualites/salon-bruxelles.jpg',
    date: '2025-03-28',
  },

  // Ajoutez vos articles ici en suivant le même modèle...
];
