import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code || !/^\d{4}$/.test(code)) {
    return json({ error: 'Invalid postal code' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.bpost.be/tax/api/v1/geographic/postalCodes/${code}`,
      { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return json({ city: null }, { status: 200 });
    const data = await res.json();
    const city = data?.municipalities?.[0]?.name ?? null;
    return json({ city }, { headers: { 'Cache-Control': 'public, max-age=86400' } });
  } catch {
    return json({ city: null }, { status: 200 });
  }
}
