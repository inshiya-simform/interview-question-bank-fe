import { useNavigate } from 'react-router-dom';
import { useNotificationsQuery } from '@/api/hooks';
import {
  NOTIFICATION_BADGE_MAX,
  NOTIFICATION_COPY,
  NOTIFICATION_FILTER,
  NOTIFICATION_PREVIEW_COUNT,
  ROUTES,
} from '@/constants';
import { useSession } from '@/features/auth';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useNotificationActions } from './useNotificationActions';

export function useNotificationBell() {
  const { user } = useSession();
  const { isOpen, toggle } = useDisclosure();
  const navigate = useNavigate();
  const { openNotification, markAllRead, isMarkingAll } = useNotificationActions();
  const { data, isPending, isError, refetch } = useNotificationsQuery(user?.id, {
    page: 1,
    limit: NOTIFICATION_PREVIEW_COUNT,
    filter: NOTIFICATION_FILTER.ALL,
  });

  const unreadCount = data?.unreadCount ?? 0;

  return {
    isOpen,
    toggle,
    // Popover reports outside clicks and Escape as "close"; it only ever closes while open.
    close: () => {
      if (isOpen) toggle();
    },
    // The trigger's accessible name carries the count the badge shows visually.
    label:
      unreadCount > 0
        ? NOTIFICATION_COPY.NAV_COUNT(unreadCount)
        : NOTIFICATION_COPY.NAV_NONE_UNREAD,
    badge:
      unreadCount > NOTIFICATION_BADGE_MAX
        ? NOTIFICATION_COPY.BADGE_OVERFLOW(NOTIFICATION_BADGE_MAX)
        : String(unreadCount),
    unreadCount,
    items: data?.notifications ?? [],
    total: data?.totalAll ?? 0,
    isLoading: isPending,
    isError,
    refetch: () => void refetch(),
    openNotification,
    markAllRead,
    isMarkingAll,
    readMore: () => {
      toggle();
      void navigate(ROUTES.NOTIFICATIONS);
    },
  };
}
