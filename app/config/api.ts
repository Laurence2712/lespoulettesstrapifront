const API_URL = typeof window !== 'undefined' 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:1337')
  : (process.env.VITE_API_URL || 'http://localhost:1337');

export const getApiUrl = () => API_URL;

export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

export const apiEndpoints = {
  homepages: `${API_URL}/api/homepages?populate=*`,
  realisations: `${API_URL}/api/realisations?populate=*`,
  actualites: `${API_URL}/api/actualites?populate=*`,
  latestActualite: `${API_URL}/api/actualites?populate=*&sort[0]=publishedAt:desc&pagination[limit]=1`,
  commandes: `${API_URL}/api/commandes`,
  createCheckoutSession: `${API_URL}/api/commandes/create-checkout-session`,
  createBankTransferOrder: `${API_URL}/api/commandes/create-bank-transfer-order`,
  realisationById: (id: string) => `${API_URL}/api/realisations/${id}?populate=*`,
  actualiteById: (id: number) => `${API_URL}/api/actualites/${id}?populate=*`,
};