import { json } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';

/**
 * Action newsletter — ajoute le contact directement dans Brevo (ex-Sendinblue)
 * Variables d'environnement requises :
 *   BREVO_API_KEY  : clé API Brevo (Paramètres → Clés API)
 *   BREVO_LIST_ID  : ID de la liste Brevo où stocker les inscrits (ex: 3)
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const recaptchaToken = formData.get('recaptchaToken');

  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return json({ error: 'Adresse email invalide.' }, { status: 400 });
  }

  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
  if (RECAPTCHA_SECRET_KEY) {
    if (!recaptchaToken || typeof recaptchaToken !== 'string') {
      return json({ error: 'Vérification anti-spam échouée. Réessayez.' }, { status: 400 });
    }
    try {
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success || verifyData.score < 0.5) {
        return json({ error: 'Vérification anti-spam échouée. Réessayez.' }, { status: 400 });
      }
    } catch (err) {
      console.error('[Newsletter] Erreur vérification reCAPTCHA:', err);
      // En cas d'échec de l'API Google, on laisse passer pour ne pas bloquer les vrais utilisateurs
    }
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

  if (!BREVO_API_KEY) {
    console.error('[Newsletter] BREVO_API_KEY manquante — vérifiez vos variables d\'environnement');
    // On retourne succès pour ne pas bloquer l'UX pendant la configuration
    return json({ success: true });
  }

  const listIds = BREVO_LIST_ID ? [parseInt(BREVO_LIST_ID, 10)] : [];

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        listIds,
        updateEnabled: true, // si déjà inscrit → pas d'erreur, on met à jour
      }),
    });

    // 201 = nouveau contact créé, 204 = contact existant mis à jour
    if (response.status === 201 || response.status === 204) {
      return json({ success: true });
    }

    const body = await response.json().catch(() => ({}));
    console.error('[Newsletter] Erreur Brevo:', response.status, body);

    // Email déjà inscrit dans certains cas de réponse Brevo
    if (response.status === 400 && body?.code === 'duplicate_parameter') {
      return json({ success: true });
    }

    return json({ error: 'Une erreur est survenue, réessayez plus tard.' }, { status: 500 });
  } catch (err) {
    console.error('[Newsletter] Erreur réseau:', err);
    return json({ error: 'Une erreur est survenue, réessayez plus tard.' }, { status: 500 });
  }
}
