import { describe, expect, it } from '@jest/globals';

import { authErrorMessage, newPasswordSchema, parseAuthRedirect, signUpSchema } from '@/features/auth/schemas';

describe('auth helpers', () => {
  it('validates sign-up input and normalises username/email', () => {
    const ok = signUpSchema.safeParse({ displayName: 'Camille', username: 'Camille.L', email: ' CAMILLE@mail.be ', password: 'carte2026' });
    expect(ok.success && ok.data).toMatchObject({ username: 'camille.l', email: 'camille@mail.be' });
    expect(signUpSchema.safeParse({ displayName: 'C', username: 'a b', email: 'nope', password: 'short' }).success).toBe(false);
    expect(signUpSchema.safeParse({ displayName: 'Camille', username: 'camille', email: 'c@m.be', password: 'onlyletters' }).success).toBe(false);
  });

  it('requires matching passwords on reset', () => {
    expect(newPasswordSchema.safeParse({ password: 'nouveau123', confirm: 'nouveau123' }).success).toBe(true);
    expect(newPasswordSchema.safeParse({ password: 'nouveau123', confirm: 'autre1234' }).success).toBe(false);
  });

  it('extracts tokens from the reset link (fragment or query)', () => {
    expect(parseAuthRedirect('lifemap://reset-password#access_token=a&refresh_token=r&type=recovery')).toEqual({
      accessToken: 'a',
      refreshToken: 'r',
      type: 'recovery',
    });
    expect(parseAuthRedirect('exp://192.168.1.2:8081/--/reset-password?access_token=a&refresh_token=r')).toMatchObject({ accessToken: 'a' });
    expect(parseAuthRedirect('lifemap://reset-password')).toBeNull();
  });

  it('turns auth errors into short French messages', () => {
    expect(authErrorMessage({ code: 'invalid_credentials' })).toBe('E-mail ou mot de passe incorrect.');
    expect(authErrorMessage({ message: 'Email not confirmed' })).toMatch(/Confirme/);
    expect(authErrorMessage({ message: 'something odd' })).toBe('Une erreur est survenue. Réessaie.');
  });
});
