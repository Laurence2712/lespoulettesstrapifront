import { Image } from 'expo-image';
import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import { Text } from './Text';

export function Avatar({ uri, name, size = 40, ring }: { uri?: string; name: string; size?: number; ring?: boolean }) {
  const { colors } = useTheme();
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View
      accessibilityLabel={`Avatar de ${name}`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.surfaceRaised,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: ring ? 2 : 0,
        borderColor: colors.accent,
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={200} />
      ) : (
        <Text variant="bodyStrong" tone="accent" style={{ fontSize: size * 0.38 }}>
          {initials}
        </Text>
      )}
    </View>
  );
}
