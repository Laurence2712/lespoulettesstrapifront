import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  const dest = sessionId
    ? `/panier/success?session_id=${sessionId}`
    : '/panier/success';
  return redirect(dest, { status: 301 });
}
