import type { SidebarNavItem } from '@/components';
import {
  CHANGE_PASSWORD_COPY,
  PERMISSIONS,
  IMPORT_COPY,
  REVIEW_COPY,
  ROLE_LABELS,
  ROUTES,
  SAVED_COPY,
} from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';
import { useSession } from '@/features/auth';
import { useReviewNav } from '@/features/review';
import { useSavedState } from '@/features/saved';

export function useAppLayout() {
  const { user, logout } = useSession();
  const { canSubmit, canReview, returnedCount, waitingCount } = useReviewNav();
  const { hasAnyPermission } = usePermissions();
  const canReadQuestions = hasAnyPermission([PERMISSIONS.QUESTION_READ]);
  const savedCount = useSavedState().totalSaved;

  const items: SidebarNavItem[] = [
    { to: ROUTES.HOME, label: REVIEW_COPY.NAV_QUESTIONS, icon: 'list', end: true },
  ];
  if (canSubmit) {
    items.push({
      to: ROUTES.MY_QUESTIONS,
      label: REVIEW_COPY.NAV_MY_SUBMISSIONS,
      icon: 'file',
      count: returnedCount,
      countLabel: REVIEW_COPY.NAV_COUNT(returnedCount),
    });
  }
  if (canReadQuestions) {
    items.push({
      to: ROUTES.SAVED,
      label: SAVED_COPY.NAV,
      icon: 'bookmark',
      count: savedCount,
      countLabel: SAVED_COPY.NAV_COUNT(savedCount),
    });
  }
  if (canReview) {
    items.push({
      to: ROUTES.REVIEW_QUEUE,
      label: REVIEW_COPY.NAV_REVIEW_QUEUE,
      icon: 'review',
      count: waitingCount,
      countLabel: REVIEW_COPY.NAV_COUNT(waitingCount),
    });
  }
  if (canSubmit) {
    items.push({ to: ROUTES.IMPORT, label: IMPORT_COPY.ENTRY, icon: 'upload' });
  }
  items.push({ to: ROUTES.CHANGE_PASSWORD, label: CHANGE_PASSWORD_COPY.NAV, icon: 'lock' });

  return {
    items,
    userName: user?.name ?? '',
    userDetail: user ? ROLE_LABELS[user.role] : '',
    userTitle: user?.email,
    logout,
  };
}
