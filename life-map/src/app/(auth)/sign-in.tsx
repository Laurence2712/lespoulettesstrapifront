import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { AuthScaffold, FormError } from '@/components/AuthScaffold';
import { Button, Field } from '@/components/ui';
import { authErrorMessage, signInSchema } from '@/features/auth/schemas';
import { haptic } from '@/lib/haptics';
import { requireSupabase } from '@/lib/supabase';

type Values = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(signInSchema), defaultValues: { email: '', password: '' } });

  const submit = handleSubmit(async (values) => {
    setError(null);
    const { error: authError } = await requireSupabase().auth.signInWithPassword(values);
    if (authError) {
      haptic.warning();
      setError(authErrorMessage(authError));
      return;
    }
    haptic.success();
    router.replace('/'); // index decides: onboarding or tabs
  });

  return (
    <AuthScaffold
      title="Bon retour"
      subtitle="Connecte-toi pour retrouver ta carte."
      footer={
        <>
          <Button label="Mot de passe oublié ?" variant="ghost" size="sm" onPress={() => router.push('/forgot-password')} />
          <Button label="Créer un compte" variant="secondary" onPress={() => router.replace('/sign-up')} fullWidth />
        </>
      }
    >
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
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={submit}
            error={errors.password?.message}
          />
        )}
      />
      <FormError message={error} />
      <Button label="Se connecter" onPress={submit} loading={isSubmitting} fullWidth />
    </AuthScaffold>
  );
}
