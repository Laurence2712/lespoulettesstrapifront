// ============================================================
// DONNÉES STATIQUES — PRODUITS (RÉALISATIONS)
// ============================================================
// Ajoutez vos produits ici. Chaque produit a :
//   - id          : identifiant unique utilisé dans l'URL (/realisations/mon-id)
//   - image_url   : chemin vers l'image dans /public/images/products/
//   - mainImages  : galerie d'images affichée sur la page détail
//   - declinaisons: variantes du produit avec stock et image propre
// ============================================================

export interface ImageData {
  id: number;
  url: string;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  };
}

export interface Declinaison {
  id: number;
  Stock: number;
  Description?: string;
  CoupDeCoeur?: boolean;
  Image: ImageData;
}

export interface Realisation {
  id: string;
  title: string;
  image_url?: string;
  description?: string;
  prix?: number;
  isNew?: boolean;
  totalStock?: number | null;
  categorie?: string;
  dimensions?: string;
  mainImages: ImageData[];
  declinaisons: Declinaison[];
}

export const realisations: Realisation[] = [
  // ── EXEMPLE 1 ──────────────────────────────────────────────
  {
    id: 'trousse-wax-ankara',
    title: 'Trousse Wax Ankara',
    image_url: '/images/products/trousse-ankara.jpg',
    description: 'Trousse en tissu wax Ankara confectionnée à la main au Bénin. Idéale pour ranger vos essentiels avec style.',
    prix: 18,
    isNew: true,
    categorie: 'Trousses',
    dimensions: '20cm × 12cm',
    mainImages: [
      {
        id: 1,
        url: '/images/products/trousse-ankara.jpg',
        formats: {
          large: { url: '/images/products/trousse-ankara.jpg' },
          thumbnail: { url: '/images/products/trousse-ankara.jpg' },
        },
      },
    ],
    declinaisons: [
      {
        id: 1,
        Stock: 3,
        Description: 'Motif Ankara bleu',
        CoupDeCoeur: true,
        Image: {
          id: 1,
          url: '/images/products/trousse-ankara.jpg',
          formats: { thumbnail: { url: '/images/products/trousse-ankara.jpg' } },
        },
      },
      {
        id: 2,
        Stock: 2,
        Description: 'Motif Ankara rouge',
        CoupDeCoeur: false,
        Image: {
          id: 2,
          url: '/images/products/trousse-ankara.jpg',
          formats: { thumbnail: { url: '/images/products/trousse-ankara.jpg' } },
        },
      },
    ],
    get totalStock() {
      return this.declinaisons.reduce((sum, d) => sum + d.Stock, 0);
    },
  },

  // ── EXEMPLE 2 ──────────────────────────────────────────────
  {
    id: 'tote-bag-kente',
    title: 'Tote Bag Kente',
    image_url: '/images/products/tote-kente.jpg',
    description: 'Tote bag spacieux en tissu Kente, tissé à la main. Résistant et coloré pour vos déplacements quotidiens.',
    prix: 25,
    isNew: false,
    categorie: 'Sacs',
    dimensions: '35cm × 40cm',
    mainImages: [
      {
        id: 3,
        url: '/images/products/tote-kente.jpg',
        formats: {
          large: { url: '/images/products/tote-kente.jpg' },
          thumbnail: { url: '/images/products/tote-kente.jpg' },
        },
      },
    ],
    declinaisons: [
      {
        id: 3,
        Stock: 4,
        Description: 'Bandes or et noir',
        CoupDeCoeur: true,
        Image: {
          id: 3,
          url: '/images/products/tote-kente.jpg',
          formats: { thumbnail: { url: '/images/products/tote-kente.jpg' } },
        },
      },
    ],
    get totalStock() {
      return this.declinaisons.reduce((sum, d) => sum + d.Stock, 0);
    },
  },

  // ── EXEMPLE 3 ──────────────────────────────────────────────
  {
    id: 'housse-ordinateur-wax',
    title: 'Housse Ordinateur Wax',
    image_url: '/images/products/housse-pc.jpg',
    description: 'Housse pour ordinateur 13" en tissu wax doublée de polaire. Protège votre matériel avec élégance.',
    prix: 35,
    isNew: true,
    categorie: 'Housses',
    dimensions: '35cm × 25cm (pour PC 13")',
    mainImages: [
      {
        id: 5,
        url: '/images/products/housse-pc.jpg',
        formats: {
          large: { url: '/images/products/housse-pc.jpg' },
          thumbnail: { url: '/images/products/housse-pc.jpg' },
        },
      },
    ],
    declinaisons: [
      {
        id: 5,
        Stock: 2,
        Description: 'Wax indigo et or',
        CoupDeCoeur: false,
        Image: {
          id: 5,
          url: '/images/products/housse-pc.jpg',
          formats: { thumbnail: { url: '/images/products/housse-pc.jpg' } },
        },
      },
      {
        id: 6,
        Stock: 0,
        Description: 'Wax terracotta',
        CoupDeCoeur: false,
        Image: {
          id: 6,
          url: '/images/products/housse-pc.jpg',
          formats: { thumbnail: { url: '/images/products/housse-pc.jpg' } },
        },
      },
    ],
    get totalStock() {
      return this.declinaisons.reduce((sum, d) => sum + d.Stock, 0);
    },
  },

  // ── EXEMPLE 4 ──────────────────────────────────────────────
  {
    id: 'porte-cles-wax',
    title: 'Porte-clés Wax',
    image_url: '/images/products/porte-cles.jpg',
    description: 'Petit porte-clés en tissu wax, parfait cadeau ou accessoire coloré du quotidien.',
    prix: 8,
    isNew: false,
    categorie: 'Accessoires',
    dimensions: '8cm × 5cm',
    mainImages: [
      {
        id: 7,
        url: '/images/products/porte-cles.jpg',
        formats: {
          large: { url: '/images/products/porte-cles.jpg' },
          thumbnail: { url: '/images/products/porte-cles.jpg' },
        },
      },
    ],
    declinaisons: [
      {
        id: 7,
        Stock: 10,
        Description: 'Motif pagne',
        CoupDeCoeur: true,
        Image: {
          id: 7,
          url: '/images/products/porte-cles.jpg',
          formats: { thumbnail: { url: '/images/products/porte-cles.jpg' } },
        },
      },
    ],
    get totalStock() {
      return this.declinaisons.reduce((sum, d) => sum + d.Stock, 0);
    },
  },

  // Ajoutez vos produits ici en suivant le même modèle...
];

export function getRealisationById(id: string): Realisation | null {
  return realisations.find((r) => r.id === id) ?? null;
}

export function getRelatedRealisations(excludeId: string, limit = 4): Realisation[] {
  return realisations.filter((r) => r.id !== excludeId).slice(0, limit);
}

export function getCoupsDeCoeur() {
  const result: Array<{
    id: number;
    productId: string;
    productTitle: string;
    prix?: number;
    image_url: string;
    motif?: string;
  }> = [];

  for (const r of realisations) {
    for (const decl of r.declinaisons) {
      if (decl.CoupDeCoeur) {
        result.push({
          id: decl.id,
          productId: r.id,
          productTitle: r.title,
          prix: r.prix,
          image_url: decl.Image?.url || r.image_url || '',
          motif: decl.Description,
        });
      }
    }
  }
  return result;
}
