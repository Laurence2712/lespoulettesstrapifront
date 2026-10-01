import { zodResolver } from '@hookform/resolvers/zod';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { AuthScaffold, FormError } from '@/components/AuthScaffold';
import { Button, Field, LoadingState, toast } from '@/components/ui';
import { authErrorMessage, newPasswordSchema, parseAuthRedirect } from '@/features/auth/schemas';
import { requireSupabase } from '@/lib/supabase';

type Values = z.infer<typeof newPasswordSchema>;

/** Opened from the reset e-mail link (lifemap://reset-password#access_token=…). */
export default function ResetPasswordScreen() {
  const url = Linking.useLinkingURL();
  const [status, setStatus] = useState<'checking' | 'ready' | 'invalid'>('checking');
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(newPasswordSchema), defaultValues: { password: '', confirm: '' } });

  useEffect(() => {
    let cancelled = false;
    const tokens = url ? parseAuthRedirect(url) : null;
    const client = requireSupabase();
    const check = tokens
      ? client.auth.setSession({ access_token: tokens.accessToken, refresh_token: tokens.refreshToken })
      : client.auth.getSession();
    check.then(({ data, error: e }) => {
      if (!cancelled) setStatus(!e && data.session ? 'ready' : 'invalid');
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const submit = handleSubmit(async ({ password }) => {
    setError(null);
    const { error: e } = await requireSupabase().auth.updateUser({ password });
    if (e) {
      setError(authErrorMessage(e));
      return;
    }
    toast('Mot de passe mis à jour.', 'success');
    router.replace('/');
  });

  if (status === 'checking') return <LoadingState label="Vérification du lien…" />;

  if (status === 'invalid') {
    return (
      <AuthScaffold title="Lien expiré" subtitle="Ce lien n’est plus valide. Demande-en un nouveau.">
        <Button label="Renvoyer un lien" onPress={() => router.replace('/forgot-password')} fullWidth />
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold title="Nouveau mot de passe">
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Nouveau mot de passe"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            hint="8 caractères minimum, avec une lettre et un chiffre."
            error={errors.password?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirm"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field label="Confirmer" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry error={errors.confirm?.message} />
        )}
      />
      <FormError message={error} />
      <Button label="Enregistrer" onPress={submit} loading={isSubmitting} fullWidth />
    </AuthScaffold>
  );
}
