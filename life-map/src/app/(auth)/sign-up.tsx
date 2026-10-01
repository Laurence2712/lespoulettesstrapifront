import { zodResolver } from '@hookform/resolvers/zod';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { AuthScaffold, FormError } from '@/components/AuthScaffold';
import { Button, EmptyState, Field } from '@/components/ui';
import { authErrorMessage, signUpSchema } from '@/features/auth/schemas';
import { haptic } from '@/lib/haptics';
import { requireSupabase } from '@/lib/supabase';

type Input = z.input<typeof signUpSchema>;
type Values = z.output<typeof signUpSchema>;

export default function SignUpScreen() {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Input, unknown, Values>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { displayName: '', username: '', email: '', password: '' },
  });

  const submit = handleSubmit(async ({ email, password, username, displayName }) => {
    setError(null);
    const { data, error: authError } = await requireSupabase().auth.signUp({
      email,
      password,
      // Read by the database trigger that creates the profile.
      options: { data: { username, display_name: displayName }, emailRedirectTo: Linking.createURL('/sign-in') },
    });
    if (authError) {
      haptic.warning();
      setError(authErrorMessage(authError));
      return;
    }
    haptic.success();
    if (data.session) router.replace('/');
    else setSentTo(email); // e-mail confirmation required
  });

  if (sentTo) {
    return (
      <AuthScaffold title="Vérifie tes e-mails">
        <EmptyState
          icon="mail-unread-outline"
          title="Presque fini"
          message={`Nous avons envoyé un lien de confirmation à ${sentTo}. Ouvre-le sur ce téléphone, puis connecte-toi.`}
          actionLabel="Aller à la connexion"
          onAction={() => router.replace('/sign-in')}
        />
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      title="Bienvenue"
      subtitle="Crée ton compte : ta carte reste privée tant que tu ne décides pas de la partager."
      footer={<Button label="J’ai déjà un compte" variant="ghost" onPress={() => router.replace('/sign-in')} />}
    >
      <Controller
        control={control}
        name="displayName"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field label="Nom" value={value} onChangeText={onChange} onBlur={onBlur} autoComplete="name" error={errors.displayName?.message} />
        )}
      />
      <Controller
        control={control}
        name="username"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Identifiant"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            hint="Tes amis te trouveront avec @identifiant."
            error={errors.username?.message}
          />
        )}
      />
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
            textContentType="emailAddress"
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Mot de passe"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            hint="8 caractères minimum, avec une lettre et un chiffre."
            error={errors.password?.message}
          />
        )}
      />
      <FormError message={error} />
      <Button label="Créer mon compte" onPress={submit} loading={isSubmitting} fullWidth />
    </AuthScaffold>
  );
}
