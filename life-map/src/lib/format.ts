const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/** `2026-09-28` → `28 septembre 2026` (year omitted when it's the current year and `short`). */
export function formatDate(iso: string, opts: { short?: boolean; now?: Date } = {}): string {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number) as [number, number, number];
  const now = opts.now ?? new Date();
  const month = MONTHS[m - 1] ?? '';
  if (opts.short && y === now.getFullYear()) return `${d} ${month}`;
  return `${d} ${month} ${y}`;
}

export function formatMonthYear(key: string): string {
  const [y, m] = key.split('-').map(Number) as [number, number];
  return `${MONTHS[m - 1]} ${y}`;
}

/** "à l'instant", "il y a 5 min", "il y a 3 h", "il y a 2 j", or a date. */
export function timeAgo(isoDateTime: string, now: Date = new Date()): string {
  const diff = Math.max(0, now.getTime() - new Date(isoDateTime).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'à l’instant';
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `il y a ${days} j`;
  return formatDate(isoDateTime, { short: true, now });
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n > 1 ? many : one}`;
}
