import { forwardRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { HIT_TARGET } from '@/theme/tokens';

import { Text } from './Text';

export type FieldProps = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
};

export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, error, hint, optional, style, multiline, ...rest },
  ref,
) {
  const { colors, radius, spacing, typography } = useTheme();
  return (
    <View style={{ gap: spacing.xs }}>
      <View style={styles.labelRow}>
        <Text variant="overline" tone="muted">
          {label}
        </Text>
        {optional ? (
          <Text variant="caption" tone="subtle">
            facultatif
          </Text>
        ) : null}
      </View>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor={colors.textSubtle}
        selectionColor={colors.accent}
        multiline={multiline}
        {...rest}
        style={[
          typography.body,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            minHeight: multiline ? 96 : HIT_TARGET + 4,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          style,
        ]}
      />
      {error ? (
        <Text variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="subtle">
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
});
