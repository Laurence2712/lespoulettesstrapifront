import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, type ComponentProps } from 'react';
import { ActivityIndicator, Animated, StyleSheet, View, type DimensionValue } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import { Button } from './Button';
import { Text } from './Text';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon: IconName;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { colors, spacing } = useTheme();
  return (
    <View style={[styles.center, { padding: spacing.xxl, gap: spacing.md }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
        <Ionicons name={icon} size={28} color={colors.accent} />
      </View>
      <Text variant="title" align="center">
        {title}
      </Text>
      <Text tone="muted" align="center" style={{ maxWidth: 300 }}>
        {message}
      </Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} style={{ marginTop: spacing.sm }} /> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title="Oups"
      message={message}
      actionLabel={onRetry ? 'Réessayer' : undefined}
      onAction={onRetry}
    />
  );
}

export function LoadingState({ label = 'Chargement…' }: { label?: string }) {
  const { colors, spacing } = useTheme();
  return (
    <View style={[styles.center, { padding: spacing.xxl, gap: spacing.md }]} accessibilityLabel={label}>
      <ActivityIndicator color={colors.accent} />
      <Text tone="muted">{label}</Text>
    </View>
  );
}

/** Pulsing placeholder block for progressive loading. */
export function Skeleton({ height = 16, width = '100%', radius = 8 }: { height?: number; width?: DimensionValue; radius?: number }) {
  const { colors } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.4));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={{ height, width, borderRadius: radius, backgroundColor: colors.surfaceRaised, opacity }} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});
