import { ALL_STATUSES, REVIEW_STATUS } from '@/constants';
import type { ReviewStatus, StatusTab } from '@/constants';
import type { MockSubmission } from './mock/seed';

const time = (value: string) => new Date(value).getTime();

export function countByStatus(items: readonly MockSubmission[]): Record<StatusTab, number> {
  const counts: Record<StatusTab, number> = {
    [ALL_STATUSES]: items.length,
    [REVIEW_STATUS.PENDING_REVIEW]: 0,
    [REVIEW_STATUS.CHANGES_REQUESTED]: 0,
    [REVIEW_STATUS.APPROVED]: 0,
    [REVIEW_STATUS.REJECTED]: 0,
  };
  for (const item of items) counts[item.status] += 1;
  return counts;
}

const matchesTab = (item: MockSubmission, tab: StatusTab) =>
  tab === ALL_STATUSES || item.status === tab;

// Items that need the submitter's attention come first, then newest.
export function selectMine(items: readonly MockSubmission[], tab: StatusTab): MockSubmission[] {
  const rank = (status: ReviewStatus) => (status === REVIEW_STATUS.CHANGES_REQUESTED ? 0 : 1);
  return items
    .filter((item) => item.isMine && matchesTab(item, tab))
    .sort((a, b) => rank(a.status) - rank(b.status) || time(b.submittedAt) - time(a.submittedAt));
}

// Oldest first so nothing waits forever.
export function selectQueue(items: readonly MockSubmission[], tab: StatusTab): MockSubmission[] {
  return items
    .filter((item) => matchesTab(item, tab))
    .sort((a, b) => time(a.submittedAt) - time(b.submittedAt));
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): T[] {
  return items.slice((page - 1) * pageSize, page * pageSize);
}
