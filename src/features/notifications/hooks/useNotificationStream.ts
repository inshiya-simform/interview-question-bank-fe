import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/api/query-keys';
import { connectNotificationStream } from '@/api/service/notificationStream.service';
import { useSession } from '@/features/auth';
import { useAuthToken } from '@/hooks/useAuthToken';
import { handleIncomingNotification } from '../liveNotification';

// Opens the live stream while signed in and aborts on logout. Re-runs only when the user or the
// signed-in state changes, not on every token refresh: the stream picks up the current token
// itself each time it reconnects. Mount once, inside the authenticated layout.
export function useNotificationStream() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const isSignedIn = useAuthToken() !== null;
  const userId = user?.id;

  useEffect(() => {
    if (!userId || !isSignedIn) return;
    const controller = new AbortController();

    void connectNotificationStream({
      signal: controller.signal,
      // Events missed while disconnected are not replayed, so resync on every (re)connect.
      onReady: () => {
        void queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT(userId),
        });
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION_LISTS(userId) });
      },
      onNotification: (notification) =>
        handleIncomingNotification(queryClient, userId, notification),
      // A rejected token is handled by the normal auth flow: refetching the user hits the 401
      // interceptor, which signs out.
      onError: () => void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_ME }),
    });

    return () => controller.abort();
  }, [queryClient, userId, isSignedIn]);
}
