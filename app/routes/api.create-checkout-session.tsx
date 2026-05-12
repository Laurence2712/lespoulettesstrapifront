import { json } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import Stripe from 'stripe';

export async function action({ request }: ActionFunctionArgs) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

  if (!STRIPE_SECRET_KEY) {
    return json({ error: 'Paiement en ligne non configuré.' }, { status: 500 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const { items, email, nom, telephone, adresse, notes } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return json({ error: 'Panier vide ou invalide.' }, { status: 400 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-03-31.basil' });

  const lineItems = items.map((item: any) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.title || 'Produit Les Poulettes',
        ...(item.image_url && item.image_url.startsWith('http')
          ? { images: [item.image_url] }
          : {}),
      },
      unit_amount: Math.round(Number(item.prix) * 100),
    },
    quantity: item.quantity || 1,
  }));

  const metadata: Record<string, string> = {
    nom: nom || '',
    telephone: telephone || '',
    adresse: adresse || '',
    notes: (notes || '').slice(0, 500),
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: email || undefined,
    success_url: `${SITE_URL}/fr/paiement-reussi?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/fr/panier`,
    metadata,
    locale: 'fr',
    shipping_address_collection: adresse?.startsWith('RETRAIT')
      ? undefined
      : { allowed_countries: ['BE', 'FR', 'NL', 'DE', 'LU'] },
  });

  return json({ url: session.url });
}
