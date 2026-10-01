import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useTheme } from '@/theme/ThemeProvider';

import { darkMapStyle } from './mapStyle';
import { WORLD_REGION, type LocationPickerProps } from './types';

/** Small map: tap anywhere or drag the pin to set the experience's location. */
export function LocationPicker({ value, onChange, height = 180 }: LocationPickerProps) {
  const { colors, radius, scheme } = useTheme();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (value) mapRef.current?.animateToRegion({ ...value, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 400);
  }, [value]);

  return (
    <View
      style={{ height, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}
      accessibilityLabel="Carte : touche pour placer l'expérience"
    >
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={value ? { ...value, latitudeDelta: 0.02, longitudeDelta: 0.02 } : WORLD_REGION}
        userInterfaceStyle={scheme}
        customMapStyle={Platform.OS === 'android' && scheme === 'dark' ? darkMapStyle : undefined}
        toolbarEnabled={false}
        onPress={(e) => onChange(e.nativeEvent.coordinate)}
      >
        {value ? (
          <Marker coordinate={value} draggable pinColor={colors.accent} onDragEnd={(e) => onChange(e.nativeEvent.coordinate)} />
        ) : null}
      </MapView>
    </View>
  );
}
