import type { CategoryId, Experience } from './types';

export type PeriodFilter = 'all' | '30d' | '12m' | 'year';

export const PERIOD_LABELS: Record<PeriodFilter, string> = {
  all: 'Toujours',
  '30d': '30 jours',
  '12m': '12 mois',
  year: 'Cette année',
};

export type ExperienceFilters = {
  categories: CategoryId[];
  period: PeriodFilter;
};

export const EMPTY_FILTERS: ExperienceFilters = { categories: [], period: 'all' };

function periodStart(period: PeriodFilter, now: Date): string | null {
  const d = new Date(now);
  switch (period) {
    case 'all':
      return null;
    case '30d':
      d.setDate(d.getDate() - 30);
      break;
    case '12m':
      d.setFullYear(d.getFullYear() - 1);
      break;
    case 'year':
      return `${now.getFullYear()}-01-01`;
  }
  return d.toISOString().slice(0, 10);
}

export function applyFilters(
  experiences: readonly Experience[],
  filters: ExperienceFilters,
  now: Date = new Date(),
): Experience[] {
  const start = periodStart(filters.period, now);
  return experiences.filter(
    (e) =>
      (filters.categories.length === 0 || filters.categories.includes(e.category)) &&
      (start === null || e.date >= start),
  );
}

export function sortByDateDesc(experiences: readonly Experience[]): Experience[] {
  return [...experiences].sort((a, b) => (a.date === b.date ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date)));
}
