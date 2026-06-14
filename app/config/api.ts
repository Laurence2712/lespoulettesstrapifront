const API_URL =
  (typeof process !== 'undefined' && process.env?.API_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_API_URL) ||
  import.meta.env?.VITE_API_URL ||
  'https://lespoulettesstrapi.onrender.com'; // ✅ fallback hardcodé

export const getApiUrl = () => API_URL;

export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

type ImageFormat = 'thumbnail' | 'small' | 'medium' | 'large';

interface StrapiImageData {
  url?: string;
  formats?: Partial<Record<ImageFormat, { url: string }>>;
}

const FORMAT_FALLBACK: Record<ImageFormat, ImageFormat[]> = {
  large:     ['large', 'medium', 'small', 'thumbnail'],
  medium:    ['medium', 'small', 'thumbnail'],
  small:     ['small', 'thumbnail'],
  thumbnail: ['thumbnail'],
};

/**
 * Returns the best available Strapi image URL for a given size hint.
 * Falls back through smaller formats → original if the preferred one isn't generated.
 */
export const getStrapiImageUrl = (
  image: StrapiImageData | undefined | null,
  prefer: ImageFormat = 'medium'
): string => {
  if (!image) return '';
  for (const fmt of FORMAT_FALLBACK[prefer]) {
    const url = image.formats?.[fmt]?.url;
    if (url) return getImageUrl(url);
  }
  return image.url ? getImageUrl(image.url) : '';
};

export const apiEndpoints = (locale = 'fr') => ({
  homepages: `${API_URL}/api/homepages?populate=*&locale=${locale}`,
  realisations: `${API_URL}/api/realisations?populate=*&locale=${locale}`,
  actualites: `${API_URL}/api/actualites?populate=*&locale=${locale}`,
  latestActualite: `${API_URL}/api/actualites?populate=*&sort[0]=publishedAt:desc&pagination[limit]=3&locale=${locale}`,
  commandes: `${API_URL}/api/commandes`,
  createCheckoutSession: `${API_URL}/api/commandes/create-checkout-session`,
  createBankTransferOrder: `${API_URL}/api/commandes/create-bank-transfer-order`,
  realisationById: (id: string) => `${API_URL}/api/realisations/${id}?populate=*&locale=${locale}`,
  actualiteById: (id: number) => `${API_URL}/api/actualites/${id}?populate=*&locale=${locale}`,
});
