import { formatDate } from './date';

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
// Past this, an exact date reads better than "12 days ago".
const RELATIVE_LIMIT_DAYS = 7;

// "5 minutes ago", "yesterday", then a plain date. Unparseable values come back unchanged.
export function formatRelativeTime(value: string, now = Date.now(), locale?: string): string {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return value;

  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const age = Math.max(0, now - time);
  if (age < MINUTE_MS) return format.format(0, 'second');
  if (age < HOUR_MS) return format.format(-Math.floor(age / MINUTE_MS), 'minute');
  if (age < DAY_MS) return format.format(-Math.floor(age / HOUR_MS), 'hour');
  if (age < RELATIVE_LIMIT_DAYS * DAY_MS) return format.format(-Math.floor(age / DAY_MS), 'day');
  return formatDate(value);
}
