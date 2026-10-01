import { View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

import type { LocationPickerProps } from './types';

export function LocationPicker({ value, height = 120 }: LocationPickerProps) {
  const { colors, radius } = useTheme();
  return (
    <View
      style={{
        height,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Text tone="muted" variant="caption" align="center">
        {value
          ? `Position : ${value.latitude.toFixed(4)}, ${value.longitude.toFixed(4)}`
          : 'Sélection sur carte disponible sur iOS et Android. Utilise la recherche de lieu.'}
      </Text>
    </View>
  );
}
