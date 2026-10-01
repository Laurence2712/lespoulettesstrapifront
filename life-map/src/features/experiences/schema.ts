import { z } from 'zod';

import { CATEGORY_IDS, VISIBILITIES } from './types';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRealPastOrTodayDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number) as [number, number, number];
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return false;
  // Allow "today" in any timezone: compare with tomorrow UTC.
  return date.getTime() <= Date.now() + 24 * 3600 * 1000;
}

export const experienceFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Donne un titre d’au moins 2 caractères.')
    .max(80, '80 caractères maximum.'),
  description: z.string().trim().max(1000, '1000 caractères maximum.').optional(),
  category: z.enum(CATEGORY_IDS, { message: 'Choisis une catégorie.' }),
  date: z.string().refine(isRealPastOrTodayDate, 'Date invalide ou dans le futur.'),
  placeName: z.string().trim().min(2, 'Indique un lieu.').max(120, '120 caractères maximum.'),
  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
  visibility: z.enum(VISIBILITIES),
  media: z
    .array(z.object({ id: z.string(), uri: z.string().min(1), width: z.number().optional(), height: z.number().optional() }))
    .max(6, '6 photos maximum.'),
});

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

/** `YYYY-MM-DD` in the device's local timezone. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Accepts `JJ/MM/AAAA` (French input) and returns `YYYY-MM-DD`, or null. */
export function parseFrenchDate(input: string): string | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(input.trim());
  if (!match) return null;
  const [, d, m, y] = match;
  const iso = `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`;
  return isRealPastOrTodayDate(iso) ? iso : null;
}
