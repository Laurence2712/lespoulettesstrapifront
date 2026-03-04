import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { getApiUrl, getImageUrl } from '../config/api';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() || '';

  if (!q || q.length < 2) {
    return json({ results: [] });
  }

  try {
    const API_URL = getApiUrl();
    const searchUrl = `${API_URL}/api/realisations?filters[Titre][$containsi]=${encodeURIComponent(q)}&populate[0]=ImagePrincipale&populate[1]=Images&pagination[limit]=8`;

    const res = await fetch(searchUrl);
    if (!res.ok) return json({ results: [] });

    const data = await res.json();
    const results = (data?.data ?? []).map((r: any) => ({
      id: r.documentId,
      title: r.Titre || '',
      prix: r.Prix,
      image_url: r.ImagePrincipale?.url
        ? getImageUrl(r.ImagePrincipale.url)
        : r.Images?.[0]?.url
          ? getImageUrl(r.Images[0].url)
          : null,
    }));

    return json({ results }, {
      headers: { 'Cache-Control': 'private, max-age=30' },
    });
  } catch {
    return json({ results: [] });
  }
}
