export const i18nConfig = {
  supportedLngs: ['fr', 'en'],
  fallbackLng: 'fr',
  defaultNS: 'common',
  ns: ['common'],
} as const;

export type Locale = 'fr' | 'en';
export const LOCALES: Locale[] = ['fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'fr';
