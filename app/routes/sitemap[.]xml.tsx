import type { LoaderFunctionArgs as _LoaderFunctionArgs } from '@remix-run/node';
import { realisations } from '../data/realisations';

const BASE_URL = 'https://lespoulettes.be';

export async function loader() {
  // Static routes
  const staticRoutes = [
    { url: BASE_URL, priority: '1.0', changefreq: 'weekly' },
    { url: `${BASE_URL}/realisations`, priority: '0.9', changefreq: 'weekly' },
    { url: `${BASE_URL}/qui-sommes-nous`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE_URL}/commandes-personnalisees`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE_URL}/actualites`, priority: '0.7', changefreq: 'weekly' },
    { url: `${BASE_URL}/guide-des-tailles`, priority: '0.7', changefreq: 'monthly' },
    { url: `${BASE_URL}/contact`, priority: '0.6', changefreq: 'monthly' },
    { url: `${BASE_URL}/faq`, priority: '0.6', changefreq: 'monthly' },
  ];

  const dynamicRoutes = realisations.map((r) => ({
    url: `${BASE_URL}/realisations/${r.id}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

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
