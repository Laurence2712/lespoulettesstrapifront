import type { Region } from '@/features/experiences/cluster';
import type { Coordinates, Experience } from '@/features/experiences/types';

export type ExperienceMapHandle = {
  focus: (region: Region) => void;
};

export type ExperienceMapProps = {
  experiences: Experience[];
  initialRegion: Region;
  selectedId?: string | null;
  onSelect: (experience: Experience) => void;
  onBackgroundPress?: () => void;
  showsUserLocation?: boolean;
  /** Extra space reserved for overlays (header, cards, tab bar). */
  padding?: { top: number; bottom: number };
  /** false = static preview (no pan/zoom), e.g. inside a scrolling profile. */
  interactive?: boolean;
};

export type LocationPickerProps = {
  value?: Coordinates;
  onChange: (coordinates: Coordinates) => void;
  height?: number;
};

export const WORLD_REGION: Region = { latitude: 30, longitude: 10, latitudeDelta: 100, longitudeDelta: 140 };
