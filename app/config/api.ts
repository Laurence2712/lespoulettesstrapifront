// No Strapi backend in this standalone version.
// All data is served from app/data/*.ts files.
// This file is kept for compatibility if any legacy import remains.

export const getApiUrl = () => '';
export const getImageUrl = (path: string) => path ?? '';
export const apiEndpoints = (_locale = 'fr') => ({});
