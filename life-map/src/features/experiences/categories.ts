import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { CategoryId, Visibility } from './types';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type CategoryMeta = {
  id: CategoryId;
  label: string;
  icon: IconName;
  /** Pin / badge color, readable on both midnight and ivory. */
  color: string;
};

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  travel: { id: 'travel', label: 'Voyage', icon: 'airplane', color: '#7FB7E0' },
  discovery: { id: 'discovery', label: 'Découverte', icon: 'compass', color: '#A4D5B9' },
  culture: { id: 'culture', label: 'Culture', icon: 'color-palette', color: '#D7A6E0' },
  encounter: { id: 'encounter', label: 'Rencontre', icon: 'people', color: '#E8876B' },
  creation: { id: 'creation', label: 'Création', icon: 'brush', color: '#E6B85C' },
  learning: { id: 'learning', label: 'Apprentissage', icon: 'school', color: '#8FD1CF' },
  other: { id: 'other', label: 'Autre', icon: 'sparkles', color: '#B8BFC4' },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORIES);

export const VISIBILITY_META: Record<Visibility, { label: string; hint: string; icon: IconName }> = {
  private: { label: 'Privé', hint: 'Visible uniquement par toi', icon: 'lock-closed' },
  friends: { label: 'Amis', hint: 'Tes amis acceptés', icon: 'people' },
  public: { label: 'Public', hint: 'Toute la communauté', icon: 'globe-outline' },
};
