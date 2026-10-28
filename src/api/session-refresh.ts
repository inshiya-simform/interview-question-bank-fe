import {
  ACCESS_TOKEN_REFRESH_LEAD_MS,
  AUTH_REFRESH_LOCK_NAME,
  HTTP_STATUS,
  MESSAGES,
} from '@/constants';
import { getJwtExpiryMs } from '@/utils/jwt';
import { ApiError } from './errors';
import type { RefreshResponse } from './type/auth/refresh';
import { getAuthToken, getRefreshToken, setAuthTokens } from './token-storage';

type ExchangeRefreshToken = (refreshToken: string) => Promise<RefreshResponse>;

// Runs `task` while holding the cross-tab lock; falls back to running it directly where the
// Web Locks API is missing (the in-tab single flight below still applies).
function withRefreshLock<T>(task: () => Promise<T>): Promise<T> {
  if (typeof navigator === 'undefined' || !('locks' in navigator)) return task();
  return navigator.locks.request(AUTH_REFRESH_LOCK_NAME, task);
}

function sessionOver() {
  return new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.ERROR_UNAUTHORIZED);
}

// A refresh token is single-use and replaying one revokes the whole session, so every refresh in
// this tab goes through one shared promise, and across tabs through one lock. Rejects with an
// ApiError; status 401 means the session is over.
export function createSessionRefresher(exchange: ExchangeRefreshToken) {
  let inFlight: Promise<string> | null = null;

  async function exchangeUnderLock(failedAccessToken: string | null): Promise<string> {
    const usedRefreshToken = getRefreshToken();
    if (!usedRefreshToken) throw sessionOver();

    return withRefreshLock(async () => {
      // Another tab may have rotated the pair while this one waited for the lock (or while the
      // failing request was in flight); spending the stale token again would revoke the session.
      const stored = getAuthToken();
      const currentRefreshToken = getRefreshToken();
      if (!currentRefreshToken || !stored) throw sessionOver();
      if (currentRefreshToken !== usedRefreshToken) return stored;
      if (failedAccessToken !== null && stored !== failedAccessToken) return stored;
      try {
        const pair = await exchange(usedRefreshToken);
        setAuthTokens(pair);
        return pair.token;
      } catch (error) {
        const unauthorized = error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED;
        const rotatedElsewhere = getRefreshToken();
        const rotatedAccessToken = getAuthToken();
        if (unauthorized && rotatedElsewhere && rotatedElsewhere !== usedRefreshToken) {
          if (rotatedAccessToken) return rotatedAccessToken;
        }
        throw error;
      }
    });
  }

  // `failedAccessToken` is the token a rejected request carried: if storage already holds a
  // different one, that request only lost a race with a refresh and needs no new exchange.
  function refresh(failedAccessToken: string | null = null): Promise<string> {
    inFlight ??= exchangeUnderLock(failedAccessToken).finally(() => {
      inFlight = null;
    });
    return inFlight;
  }

  // Returns a usable access token, refreshing first when it is missing its expiry or within the
  // lead time of it. Null when signed out.
  async function ensureFresh(): Promise<string | null> {
    const token = getAuthToken();
    if (!token) return null;
    const expiry = getJwtExpiryMs(token);
    if (expiry !== null && expiry - Date.now() > ACCESS_TOKEN_REFRESH_LEAD_MS) return token;
    return refresh(token);
  }

  return { refresh, ensureFresh };
}
