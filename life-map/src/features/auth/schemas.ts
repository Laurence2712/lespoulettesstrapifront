import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Adresse e-mail invalide.');
const password = z
  .string()
  .min(8, '8 caractères minimum.')
  .max(72, '72 caractères maximum.')
  .regex(/[A-Za-z]/, 'Ajoute au moins une lettre.')
  .regex(/\d/, 'Ajoute au moins un chiffre.');

export const signInSchema = z.object({ email, password: z.string().min(1, 'Mot de passe requis.') });

export const signUpSchema = z.object({
  displayName: z.string().trim().min(2, 'Au moins 2 caractères.').max(50, '50 caractères maximum.'),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9._]{3,24}$/, '3 à 24 caractères : lettres, chiffres, point ou _.'),
  email,
  password,
});

export const forgotSchema = z.object({ email });

export const newPasswordSchema = z
  .object({ password, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: 'Les mots de passe ne correspondent pas.', path: ['confirm'] });

/** Supabase auth errors → short French messages (never reveal whether an e-mail exists). */
export function authErrorMessage(error: { message?: string; code?: string } | null | undefined): string {
  const code = error?.code ?? '';
  const msg = (error?.message ?? '').toLowerCase();
  if (code === 'invalid_credentials' || msg.includes('invalid login')) return 'E-mail ou mot de passe incorrect.';
  if (code === 'email_not_confirmed' || msg.includes('not confirmed')) return 'Confirme d’abord ton adresse e-mail (lien reçu par e-mail).';
  if (code === 'user_already_exists' || msg.includes('already registered')) return 'Un compte existe déjà avec cette adresse.';
  if (code === 'weak_password') return 'Mot de passe trop faible.';
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || msg.includes('rate limit'))
    return 'Trop de tentatives. Réessaie dans quelques minutes.';
  if (msg.includes('network') || msg.includes('fetch')) return 'Connexion impossible. Vérifie ton réseau.';
  return 'Une erreur est survenue. Réessaie.';
}

/** Reads `access_token` / `refresh_token` from a Supabase redirect URL (fragment or query). */
export function parseAuthRedirect(url: string): { accessToken: string; refreshToken: string; type?: string } | null {
  const hashIndex = url.indexOf('#');
  const queryIndex = url.indexOf('?');
  const raw = hashIndex >= 0 ? url.slice(hashIndex + 1) : queryIndex >= 0 ? url.slice(queryIndex + 1) : '';
  const params = new URLSearchParams(raw);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken, type: params.get('type') ?? undefined };
}
