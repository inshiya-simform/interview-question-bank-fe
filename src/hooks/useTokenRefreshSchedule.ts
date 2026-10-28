import { useEffect } from 'react';
import { ensureFreshAccessToken } from '@/api';
import { ACCESS_TOKEN_REFRESH_LEAD_MS } from '@/constants';
import { getJwtExpiryMs } from '@/utils/jwt';
import { useAuthToken } from './useAuthToken';

// Refreshes the access token shortly before it expires, through the same single-flight path the
// 401 handler uses. Re-arms itself whenever the stored token changes. Failures are left to the
// 401 handler: a session ended by a rejected refresh token already redirects to login.
export function useTokenRefreshSchedule() {
  const token = useAuthToken();

  useEffect(() => {
    if (!token) return;
    const expiry = getJwtExpiryMs(token);
    if (expiry === null) return;

    const refresh = () => void ensureFreshAccessToken().catch(() => undefined);
    const timer = window.setTimeout(
      refresh,
      Math.max(expiry - ACCESS_TOKEN_REFRESH_LEAD_MS - Date.now(), 0),
    );
    // Timers are throttled in background tabs, so also check when the tab becomes visible.
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [token]);
}
