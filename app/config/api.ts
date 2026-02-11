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
  homepages: `${API_URL}/api/homepages?populate[banner_image][fields][0]=url&populate[banner_image][fields][1]=formats&populate[description]=*`,
  realisations: `${API_URL}/api/realisations?populate[Images][fields][0]=url&fields[0]=Titre&fields[1]=Description&fields[2]=Prix&fields[3]=documentId`,
  actualites: `${API_URL}/api/actualites?populate[image][fields][0]=url&populate[image][fields][1]=formats&fields[0]=Title&fields[1]=content&fields[2]=publishedAt`,
  latestActualite: `${API_URL}/api/actualites?populate[image][fields][0]=url&populate[image][fields][1]=formats&fields[0]=Title&fields[1]=content&sort[0]=publishedAt:desc&pagination[limit]=1`,
  commandes: `${API_URL}/api/commandes`,
  createCheckoutSession: `${API_URL}/api/commandes/create-checkout-session`,
  realisationById: (id: number) => `${API_URL}/api/realisations/${id}?populate[Declinaison][populate]=Image&populate=Images`,
  actualiteById: (id: number) => `${API_URL}/api/actualites/${id}?populate=*`,
};