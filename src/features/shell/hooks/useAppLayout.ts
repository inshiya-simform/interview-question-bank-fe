import type { SidebarNavItem } from '@/components';
import { IMPORT_COPY, REVIEW_COPY, ROLE_LABELS, ROUTES } from '@/constants';
import { useSession } from '@/features/auth';
import { useReviewNav } from '@/features/review';

export function useAppLayout() {
  const { user, logout } = useSession();
  const { canSubmit, canReview, returnedCount, waitingCount } = useReviewNav();

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

  return {
    items,
    userName: user?.name ?? '',
    userDetail: user ? ROLE_LABELS[user.role] : '',
    userTitle: user?.email,
    logout,
  };
}
