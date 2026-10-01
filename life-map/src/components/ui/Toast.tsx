import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { useTheme } from '@/theme/ThemeProvider';

import { Text } from './Text';

type Tone = 'success' | 'info' | 'error';
type ToastState = { message: string | null; tone: Tone; seq: number; show: (message: string, tone?: Tone) => void };

export const useToast = create<ToastState>((set) => ({
  message: null,
  tone: 'info',
  seq: 0,
  show: (message, tone = 'info') => set((s) => ({ message, tone, seq: s.seq + 1 })),
}));

export const toast = (message: string, tone?: Tone) => useToast.getState().show(message, tone);

export function ToastHost() {
  const { message, tone, seq } = useToast();
  const { colors, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!message) return;
    anim.setValue(0);
    const seqAnim = Animated.sequence([
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }),
      Animated.delay(2400),
      Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]);
    seqAnim.start();
    return () => seqAnim.stop();
  }, [anim, message, seq]);

  if (!message) return null;
  const icon = tone === 'success' ? 'checkmark-circle' : tone === 'error' ? 'alert-circle' : 'information-circle';
  const iconColor = tone === 'error' ? colors.danger : colors.accent;

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[
        styles.toast,
        {
          top: insets.top + 8,
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.border,
          borderRadius: radius.pill,
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text variant="bodyStrong" style={{ flexShrink: 1 }}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
