import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { DEFAULT_LOCALE } from '../i18n';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  const dest = sessionId
    ? `/${DEFAULT_LOCALE}/panier/success?session_id=${sessionId}`
    : `/${DEFAULT_LOCALE}/`;
  return redirect(dest, { status: 302 });
}
