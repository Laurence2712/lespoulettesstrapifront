import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { realisations } from '../data/realisations';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim().toLowerCase() || '';

  if (!q || q.length < 2) {
    return json({ results: [] });
  }

  const results = realisations
    .filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.categorie?.toLowerCase().includes(q)
    )
    .slice(0, 8)
    .map((r) => ({
      id: r.id,
      title: r.title,
      prix: r.prix,
      image_url: r.image_url ?? r.mainImages?.[0]?.url ?? null,
    }));

  return json({ results }, {
    headers: { 'Cache-Control': 'private, max-age=30' },
  });
}
