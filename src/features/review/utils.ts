import type { ReviewContent } from '@/api';
import { REVIEW_COPY } from '@/constants';

export function formatTags(tags: ReviewContent['tags']): string {
  const groups = Object.entries(tags)
    .filter(([, names]) => names.length > 0)
    .map(([category, names]) => `${category}: ${names.join(', ')}`);
  return groups.length > 0 ? groups.join('; ') : REVIEW_COPY.NONE;
}

export const formatClient = (content: ReviewContent): string =>
  content.client?.name ?? REVIEW_COPY.NONE;
