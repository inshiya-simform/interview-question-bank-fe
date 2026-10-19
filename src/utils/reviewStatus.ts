import { ALL_STATUSES } from '@/constants';
import type { ReviewStatus, StatusTab } from '@/constants';

// "All" sends no status so the API applies its default set.
export function tabToStatuses(tab: StatusTab): ReviewStatus[] | undefined {
  return tab === ALL_STATUSES ? undefined : [tab];
}
