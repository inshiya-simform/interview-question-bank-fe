import { useQuestionCountsQuery } from '@/api/hooks';
import { PERMISSIONS, REVIEW_STATUS } from '@/constants';
import { useSession } from '@/features/auth';
import { usePermissions } from '@/hooks/usePermissions';
import { countsFromApi } from '../selectors';

// Counters mean "needs attention": returned items for submitters, waiting items for reviewers.
export function useReviewNav() {
  const { hasAnyPermission } = usePermissions();
  const { user } = useSession();
  const canSubmit = hasAnyPermission([PERMISSIONS.QUESTION_CREATE]);
  const canReview = hasAnyPermission([PERMISSIONS.QUESTION_REVIEW]);
  // The shell wraps every signed-in page, so skip the request for roles that never see counters.
  const { data } = useQuestionCountsQuery(user?.id, canSubmit || canReview);
  const counts = countsFromApi(data?.counts ?? {});

  return {
    canSubmit,
    canReview,
    returnedCount: counts[REVIEW_STATUS.CHANGES_REQUESTED],
    waitingCount: counts[REVIEW_STATUS.PENDING_REVIEW],
  };
}
