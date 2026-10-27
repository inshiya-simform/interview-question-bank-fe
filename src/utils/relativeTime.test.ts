import { describe, expect, it } from 'vitest';
import { formatRelativeTime } from './relativeTime';

const NOW = Date.parse('2026-10-27T12:00:00Z');
const ago = (ms: number) => new Date(NOW - ms).toISOString();

describe('formatRelativeTime', () => {
  it('reports the last minute as now', () => {
    expect(formatRelativeTime(ago(10_000), NOW, 'en')).toBe('now');
  });

  it('uses minutes, hours and days', () => {
    expect(formatRelativeTime(ago(5 * 60_000), NOW, 'en')).toBe('5 minutes ago');
    expect(formatRelativeTime(ago(2 * 3_600_000), NOW, 'en')).toBe('2 hours ago');
    expect(formatRelativeTime(ago(86_400_000), NOW, 'en')).toBe('yesterday');
  });

  it('falls back to a date after a week', () => {
    expect(formatRelativeTime(ago(10 * 86_400_000), NOW, 'en')).not.toMatch(/ago/);
  });

  it('returns unparseable values unchanged', () => {
    expect(formatRelativeTime('soon', NOW, 'en')).toBe('soon');
  });
});
