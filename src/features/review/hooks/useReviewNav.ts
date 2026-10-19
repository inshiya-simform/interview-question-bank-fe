import { PERMISSIONS, REVIEW_STATUS } from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';
import { countByStatus } from '../selectors';
import { useSubmissions } from './useSubmissions';

// Counters mean "needs attention": returned items for submitters, waiting items for reviewers.
export function useReviewNav() {
  const { hasAnyPermission } = usePermissions();
  const all = useSubmissions();

  return {
    canSubmit: hasAnyPermission([PERMISSIONS.QUESTION_CREATE]),
    canReview: hasAnyPermission([PERMISSIONS.QUESTION_REVIEW]),
    returnedCount: countByStatus(all.filter((item) => item.isMine))[
      REVIEW_STATUS.CHANGES_REQUESTED
    ],
    waitingCount: countByStatus(all)[REVIEW_STATUS.PENDING_REVIEW],
  };
}
