import { fetchEventSource } from '@microsoft/fetch-event-source';
import { HTTP_STATUS, NOTIFICATION_STREAM_BACKOFF, NOTIFICATION_STREAM_EVENT } from '@/constants';
import { backoffDelay } from '@/utils/backoff';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { notificationSchema } from '../type/notifications/shared';
import type { Notification } from '../type/notifications/shared';

export interface NotificationStreamOptions {
  token: string;
  signal: AbortSignal;
  onReady: () => void;
  onNotification: (notification: Notification) => void;
  // Called once, only when the stream gave up for good (e.g. 401). Retryable failures are silent.
  onError?: (error: unknown) => void;
}

// Thrown to stop the library's retry loop; any other error is retried with backoff.
export class NotificationStreamFatalError extends Error {
  status: number;

  constructor(status: number) {
    super(`Notification stream rejected with status ${status}`);
    this.name = 'NotificationStreamFatalError';
    this.status = status;
  }
}

class NotificationStreamRetryableError extends Error {}

function parseEventData(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
}

// The library only reports thrown errors, not responses, so the status is checked in onopen.
// Resolves when the signal aborts or the stream fails fatally; it never rejects.
export async function connectNotificationStream({
  token,
  signal,
  onReady,
  onNotification,
  onError,
}: NotificationStreamOptions): Promise<void> {
  let attempt = 0;

  try {
    await fetchEventSource(
      `${apiClient.defaults.baseURL ?? ''}${API_ENDPOINTS.NOTIFICATIONS.STREAM}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        openWhenHidden: true,
        async onopen(response) {
          if (response.status === HTTP_STATUS.UNAUTHORIZED) {
            throw new NotificationStreamFatalError(response.status);
          }
          if (!response.ok) throw new NotificationStreamRetryableError();
          attempt = 0;
        },
        onmessage(event) {
          // Ping comments never reach here; the library drops them.
          if (event.event === NOTIFICATION_STREAM_EVENT.READY) {
            onReady();
            return;
          }
          if (event.event !== NOTIFICATION_STREAM_EVENT.NOTIFICATION) return;
          const parsed = notificationSchema.safeParse(parseEventData(event.data));
          if (!parsed.success) {
            // A bad event must not drop the connection; the list refetches on the next ready.
            console.error('Ignored malformed notification event', parsed.error);
            return;
          }
          onNotification(parsed.data);
        },
        // The server ending a stream is a normal reconnect, so route it through onerror.
        onclose() {
          throw new NotificationStreamRetryableError();
        },
        onerror(error) {
          if (error instanceof NotificationStreamFatalError) throw error;
          const delay = backoffDelay(attempt, {
            initialMs: NOTIFICATION_STREAM_BACKOFF.INITIAL_MS,
            maxMs: NOTIFICATION_STREAM_BACKOFF.MAX_MS,
            factor: NOTIFICATION_STREAM_BACKOFF.FACTOR,
          });
          attempt += 1;
          return delay;
        },
      },
    );
  } catch (error) {
    if (!signal.aborted) onError?.(error);
  }
}
