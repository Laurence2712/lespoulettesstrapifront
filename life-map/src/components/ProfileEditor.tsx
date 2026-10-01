import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { z } from 'zod';

import { Avatar, Button, Field, Text } from '@/components/ui';
import { useData, useMe } from '@/features/experiences/store';
import { useTheme } from '@/theme/ThemeProvider';

export const profileSchema = z.object({
  displayName: z.string().trim().min(2, 'Au moins 2 caractères.').max(50, '50 caractères maximum.'),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9._]{3,24}$/, '3 à 24 caractères : lettres, chiffres, point ou _.'),
  bio: z.string().trim().max(160, '160 caractères maximum.').optional(),
  avatarUrl: z.string().optional(),
});

type ProfileInput = z.input<typeof profileSchema>;
type ProfileValues = z.output<typeof profileSchema>;

export function ProfileEditor({
  submitLabel,
  onSaved,
  markOnboarded,
}: {
  submitLabel: string;
  onSaved: () => void;
  /** Set on the onboarding screen: records server-side that onboarding is done. */
  markOnboarded?: boolean;
}) {
  const { spacing } = useTheme();
  const me = useMe();
  const profiles = useData((s) => s.profiles);
  const updateMyProfile = useData((s) => s.updateMyProfile);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: me.displayName, username: me.username, bio: me.bio ?? '', avatarUrl: me.avatarUrl },
  });
  const avatarUrl = useWatch({ control, name: 'avatarUrl' });
  const displayName = useWatch({ control, name: 'displayName' });

  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7, exif: false });
    if (!res.canceled && res.assets[0]) setValue('avatarUrl', res.assets[0].uri);
  };

  const save = handleSubmit(async (values) => {
    // Quick local check; with Supabase the UNIQUE constraint is the real guard.
    if (profiles.some((p) => p.id !== me.id && p.username === values.username)) {
      setError('username', { message: 'Cet identifiant est déjà pris.' });
      return;
    }
    try {
      await updateMyProfile({
        displayName: values.displayName,
        username: values.username,
        bio: values.bio || undefined,
        avatarUrl: values.avatarUrl,
        onboarded: markOnboarded,
      });
      onSaved();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Enregistrement impossible.';
      if (message.includes('identifiant')) setError('username', { message });
      else setError('root', { message: `Enregistrement impossible : ${message}` });
    }
  });

  return (
    <View style={{ gap: spacing.lg }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Changer d’avatar" onPress={pickAvatar} style={{ alignItems: 'center', gap: spacing.sm }}>
        <Avatar uri={avatarUrl} name={displayName || '?'} size={88} ring />
        <Text tone="accent" variant="caption" style={{ fontWeight: '600' }}>
          Changer la photo
        </Text>
      </Pressable>
      <Controller
        control={control}
        name="displayName"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field label="Nom" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.displayName?.message} autoComplete="name" />
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
            error={errors.username?.message}
            hint="Les autres te trouvent avec @identifiant."
          />
        )}
      />
      <Controller
        control={control}
        name="bio"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field label="Présentation" optional multiline value={value} onChangeText={onChange} onBlur={onBlur} maxLength={160} error={errors.bio?.message} />
        )}
      />
      {errors.root ? (
        <Text tone="danger" variant="caption" accessibilityLiveRegion="polite">
          {errors.root.message}
        </Text>
      ) : null}
      <Button label={submitLabel} onPress={save} loading={isSubmitting} fullWidth />
    </View>
  );
}
