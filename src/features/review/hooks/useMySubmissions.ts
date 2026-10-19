import { ALL_STATUSES, SUBMISSION_TABS } from '@/constants';
import { useSubmissionList } from './useSubmissionList';

export function useMySubmissions() {
  return useSubmissionList(SUBMISSION_TABS, ALL_STATUSES);
}
