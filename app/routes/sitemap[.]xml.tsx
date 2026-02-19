import type { LoaderFunctionArgs } from '@remix-run/node';
import { getApiUrl } from '../config/api';

const BASE_URL = 'https://lespoulettes.be';

export async function loader({ request }: LoaderFunctionArgs) {
  const API_URL = getApiUrl();

  // Static routes
  const staticRoutes = [
    { url: BASE_URL, priority: '1.0', changefreq: 'weekly' },
    { url: `${BASE_URL}/realisations`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE_URL}/actualites`, priority: '0.7', changefreq: 'weekly' },
    { url: `${BASE_URL}/contact`, priority: '0.6', changefreq: 'monthly' },
  ];

  // Dynamic product routes
  let dynamicRoutes: { url: string; priority: string; changefreq: string }[] = [];
  try {
    const response = await fetch(`${API_URL}/api/realisations?fields[0]=documentId&pagination[pageSize]=100`);
    if (response.ok) {
      const data = await response.json();
      if (data?.data) {
        dynamicRoutes = data.data.map((item: { documentId: string }) => ({
          url: `${BASE_URL}/realisations/${item.documentId}`,
          priority: '0.8',
          changefreq: 'weekly',
        }));
      }
    }
  } catch {
    // Fallback silencieux
  }

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
