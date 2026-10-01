import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

/** Shared frame for sign-in / sign-up / password screens. */
export function AuthScaffold({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  const { spacing } = useTheme();
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen contentContainerStyle={{ gap: spacing.xl, paddingTop: spacing.xxxl }}>
        <View style={{ gap: spacing.xs }}>
          <Text variant="overline" tone="accent">
            LIFE MAP
          </Text>
          <Text variant="display" accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text tone="muted">{subtitle}</Text> : null}
        </View>
        <View style={{ gap: spacing.lg }}>{children}</View>
        {footer ? <View style={{ gap: spacing.sm, alignItems: 'center' }}>{footer}</View> : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <Text tone="danger" accessibilityRole="alert" accessibilityLiveRegion="polite">
      {message}
    </Text>
  );
}
