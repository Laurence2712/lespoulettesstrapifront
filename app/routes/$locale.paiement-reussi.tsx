import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const locale = params.locale ?? 'fr';
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  const dest = sessionId
    ? `/${locale}/panier/success?session_id=${sessionId}`
    : `/${locale}/panier/success`;
  return redirect(dest, { status: 301 });
}
