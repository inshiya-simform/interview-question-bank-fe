import type { ReviewContent, ReviewedQuestion } from '@/api';
import { REVIEW_COPY } from '@/constants';

// One entry per selected card, taken from the list the reviewer is looking at.
export function buildExpectedUpdatedAt(
  items: readonly ReviewedQuestion[],
  selectedIds: readonly string[],
): Record<string, string> {
  return Object.fromEntries(
    items.filter((item) => selectedIds.includes(item.id)).map((item) => [item.id, item.updatedAt]),
  );
}

export function formatTags(tags: ReviewContent['tags']): string {
  const groups = Object.entries(tags)
    .filter(([, names]) => names.length > 0)
    .map(([category, names]) => `${category}: ${names.join(', ')}`);
  return groups.length > 0 ? groups.join('; ') : REVIEW_COPY.NONE;
}

export const formatClient = (content: ReviewContent): string =>
  content.client?.name ?? REVIEW_COPY.NONE;
