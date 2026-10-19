import { useQuestionCountsQuery } from '@/api/hooks';
import { PERMISSIONS, REVIEW_STATUS } from '@/constants';
import { useSession } from '@/features/auth';
import { usePermissions } from '@/hooks/usePermissions';
import { countsFromApi } from '../selectors';

// Counters mean "needs attention": returned items for submitters, waiting items for reviewers.
export function useReviewNav() {
  const { hasAnyPermission } = usePermissions();
  const { user } = useSession();
  const { data } = useQuestionCountsQuery(user?.id);
  const counts = countsFromApi(data?.counts ?? {});

  return {
    canSubmit: hasAnyPermission([PERMISSIONS.QUESTION_CREATE]),
    canReview: hasAnyPermission([PERMISSIONS.QUESTION_REVIEW]),
    returnedCount: counts[REVIEW_STATUS.CHANGES_REQUESTED],
    waitingCount: counts[REVIEW_STATUS.PENDING_REVIEW],
  };
}
