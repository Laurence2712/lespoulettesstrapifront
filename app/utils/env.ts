// Pour Remix avec Vite, les variables d'environnement côté client doivent utiliser import.meta.env
export const STRAPI_URL = typeof window !== 'undefined'
  ? (import.meta.env.VITE_STRAPI_URL || 'https://lespoulettesstrapi.onrender.com')
  : 'https://lespoulettesstrapi.onrender.com';

// Helper pour construire des URLs API
export const getApiUrl = (endpoint: string) => {
  return `${STRAPI_URL}${endpoint}`;
};
