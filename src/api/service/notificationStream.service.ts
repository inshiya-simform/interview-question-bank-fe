import { fetchEventSource } from '@microsoft/fetch-event-source';
import {
  BEARER_PREFIX,
  HTTP_STATUS,
  NOTIFICATION_STREAM_BACKOFF,
  NOTIFICATION_STREAM_EVENT,
  NOTIFICATION_STREAM_RECONNECT_MS,
} from '@/constants';
import { backoffDelay } from '@/utils/backoff';
import { apiClient, ensureFreshAccessToken, refreshAccessToken } from '../client';
import { ApiError } from '../errors';
import { API_ENDPOINTS } from '../endpoints';
import { notificationSchema } from '../type/notifications/shared';
import type { Notification } from '../type/notifications/shared';

export interface NotificationStreamOptions {
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

// Runs before every (re)connect, so a stream reopened after the server dropped it at token expiry
// carries a fresh token. A refresh token rejected here has already redirected to login.
function createFreshTokenFetch(onTokenUsed: (token: string) => void) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const token = await ensureFreshAccessToken();
      if (!token) throw new NotificationStreamFatalError(HTTP_STATUS.UNAUTHORIZED);
      onTokenUsed(token);
      const headers = new Headers(init?.headers);
      headers.set('Authorization', `${BEARER_PREFIX}${token}`);
      return await window.fetch(input, { ...init, headers });
    } catch (error) {
      if (error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED) {
        throw new NotificationStreamFatalError(error.status);
      }
      throw error;
    }
  };
}

// The library only reports thrown errors, not responses, so the status is checked in onopen.
// Resolves when the signal aborts or the stream fails fatally; it never rejects.
export async function connectNotificationStream({
  signal,
  onReady,
  onNotification,
  onError,
}: NotificationStreamOptions): Promise<void> {
  let attempt = 0;
  let closedByServer = false;
  let sentToken: string | null = null;

  try {
    await fetchEventSource(
      `${apiClient.defaults.baseURL ?? ''}${API_ENDPOINTS.NOTIFICATIONS.STREAM}`,
      {
        fetch: createFreshTokenFetch((token) => {
          sentToken = token;
        }),
        signal,
        openWhenHidden: true,
        async onopen(response) {
          if (response.status === HTTP_STATUS.UNAUTHORIZED) {
            // The token expired between the freshness check and the server's own. A rejected
            // refresh token ends the session (fatal); otherwise reconnect with the new token.
            try {
              await refreshAccessToken(sentToken);
            } catch (error) {
              if (error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED) {
                throw new NotificationStreamFatalError(response.status);
              }
            }
            throw new NotificationStreamRetryableError();
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
        // The server ends the stream when the access token expires: a routine reconnect, not a
        // failure. Routed through onerror (the only way to retry), flagged so no backoff applies.
        onclose() {
          closedByServer = true;
          throw new NotificationStreamRetryableError();
        },
        onerror(error) {
          if (error instanceof NotificationStreamFatalError) throw error;
          if (closedByServer) {
            closedByServer = false;
            return NOTIFICATION_STREAM_RECONNECT_MS;
          }
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
