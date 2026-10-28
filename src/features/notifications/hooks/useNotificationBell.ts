import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotificationList } from '@/api/hooks';
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
  const { pathname, search } = useLocation();
  const close = () => {
    if (isOpen) toggle();
  };
  const { openNotification, markAllRead, isMarkingAll } = useNotificationActions(close);
  const { data, isPending, isError, refetch } = useNotificationList(user?.id, {
    page: 1,
    limit: NOTIFICATION_PREVIEW_COUNT,
    status: NOTIFICATION_FILTER.ALL,
  });

  // Any navigation, including back/forward, dismisses the panel.
  useEffect(() => {
    if (isOpen) toggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  const unreadCount = data?.unreadCount ?? 0;

  return {
    isOpen,
    toggle,
    // Popover reports outside clicks and Escape as "close"; it only ever closes while open.
    close,
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
    items: data?.items ?? [],
    total: data?.total ?? 0,
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
