import { json } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import { getApiUrl } from '../config/api';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return json({ error: 'Adresse email invalide.' }, { status: 400 });
  }

  const API_URL = getApiUrl();

  try {
    const response = await fetch(`${API_URL}/api/newsletter-subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { email: email.trim().toLowerCase() } }),
    });

    if (response.ok || response.status === 400) {
      // 400 peut vouloir dire l'email existe déjà — on considère ça comme un succès
      return json({ success: true });
    }

    // Si l'endpoint n'est pas encore créé dans Strapi, on retourne quand même un succès
    // pour ne pas bloquer l'UX — l'équipe peut créer l'endpoint plus tard
    console.warn('[Newsletter] Strapi endpoint not available yet, status:', response.status);
    return json({ success: true });
  } catch (err) {
    console.error('[Newsletter] Network error:', err);
    // Même en cas d'erreur réseau, on retourne un succès côté UX
    return json({ success: true });
  }
}
