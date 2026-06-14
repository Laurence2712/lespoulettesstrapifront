// Central configuration for site-wide constants
// Change values here — no need to touch individual routes or components

export const SITE_CONFIG = {
  name: 'Les Poulettes',
  url: 'https://lespoulettes.be',
  logo: 'https://lespoulettes.be/assets/logo_t_poulettes.png',
  email: 'lespoulettes.benin@gmail.com',
  phone: '+229 01 62 00 75 80',
  phoneE164: '+2290162007580',
  whatsappUrl: 'https://wa.me/2290162007580',
  instagram: 'https://www.instagram.com/lespoulettes.benin/',
  facebook: 'https://www.facebook.com/lespoulettescouture',
  address: {
    country: 'BJ',
    city: 'Cotonou',
  },
} as const;

export const SHIPPING_COSTS: Record<string, { label: string; cost: number }> = {
  belgique: { label: 'Belgique', cost: 7.75 },
  europe: { label: 'Autre pays Europe', cost: 12 },
};

export const PICKUP_LOCATIONS = [
  {
    id: 'grimbergen' as const,
    label: 'Grimbergen',
    flag: '🇧🇪',
    descKey: 'cart.pickup_exact',
  },
  {
    id: 'benin' as const,
    label: 'Bénin — Cotonou',
    flag: '🇧🇯',
    descKey: 'cart.pickup_exact_benin',
  },
] as const;

export type PickupLocationId = typeof PICKUP_LOCATIONS[number]['id'];

export const buildPickupAddress = (id: PickupLocationId): string => {
  if (id === 'grimbergen') return 'RETRAIT GRATUIT — Grimbergen, Belgique (adresse exacte communiquée par email)';
return 'RETRAIT GRATUIT — Bénin, Cotonou (adresse communiquée par email)';
};
