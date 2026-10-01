import { zodResolver } from '@hookform/resolvers/zod';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { AuthScaffold, FormError } from '@/components/AuthScaffold';
import { Button, EmptyState, Field } from '@/components/ui';
import { authErrorMessage, forgotSchema } from '@/features/auth/schemas';
import { requireSupabase } from '@/lib/supabase';

type Values = z.infer<typeof forgotSchema>;

export default function ForgotPasswordScreen() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(forgotSchema), defaultValues: { email: '' } });

  const submit = handleSubmit(async ({ email }) => {
    setError(null);
    const { error: authError } = await requireSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL('/reset-password'),
    });
    // Same confirmation whether or not the address exists (no account enumeration).
    if (authError && authError.status !== 400 && authError.status !== 404) {
      setError(authErrorMessage(authError));
      return;
    }
    setSent(true);
  });

  if (sent) {
    return (
      <AuthScaffold title="E-mail envoyé">
        <EmptyState
          icon="mail-outline"
          title="Vérifie ta boîte"
          message="Si un compte existe pour cette adresse, tu vas recevoir un lien pour choisir un nouveau mot de passe. Ouvre-le sur ce téléphone."
          actionLabel="Retour à la connexion"
          onAction={() => router.replace('/sign-in')}
        />
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold title="Mot de passe oublié" subtitle="Indique ton e-mail : on t’envoie un lien pour le réinitialiser.">
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="E-mail"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            error={errors.email?.message}
          />
        )}
      />
      <FormError message={error} />
      <Button label="Envoyer le lien" onPress={submit} loading={isSubmitting} fullWidth />
      <Button label="Retour" variant="ghost" onPress={() => router.back()} />
    </AuthScaffold>
  );
}
