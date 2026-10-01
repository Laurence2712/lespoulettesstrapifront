import type { MapStyleElement } from 'react-native-maps';

/** Google Maps (Android) dark style tuned to the Midnight / Forest palette. iOS uses native dark mode. */
export const darkMapStyle: MapStyleElement[] = [
  { elementType: 'geometry', stylers: [{ color: '#14222C' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8A9AA3' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#101B24' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#2A3B47' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#172A27' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }, { color: '#1B332D' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#22323D' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2B3E4A' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0B141B' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4C5E69' }] },
];
