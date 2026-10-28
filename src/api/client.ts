import axios, { isAxiosError } from 'axios';
import type { AxiosError } from 'axios';
import { queryClient } from '@/config/queryClient';
import { BEARER_PREFIX, HTTP_STATUS, MESSAGES, NETWORK_ERROR_STATUS, ROUTES } from '@/constants';
import { API_ENDPOINTS } from './endpoints';
import { ApiError, extractErrorMessage } from './errors';
import { createSessionRefresher } from './session-refresh';
import { clearAuthToken, getAuthToken, markSessionExpired } from './token-storage';
import { refreshResponseSchema, refreshTokenPayloadSchema } from './type/auth/refresh';

declare module 'axios' {
  interface AxiosRequestConfig {
    // Set on the one retry after a token refresh, so a request is never retried twice.
    hasRetriedAuth?: boolean;
  }
}

// Credential endpoints return 401 for bad input, which must not be treated as an expired session.
// They also never carry the access token, and a 401 from them is never refreshed.
const PUBLIC_PATHS: readonly string[] = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REGISTER,
  API_ENDPOINTS.AUTH.REFRESH,
  API_ENDPOINTS.AUTH.LOGOUT,
  API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
  API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN,
  API_ENDPOINTS.AUTH.RESET_PASSWORD,
];

export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && !PUBLIC_PATHS.includes(config.url ?? ''))
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Lives here (not in a service) because the interceptor below needs it and services import this file.
async function exchangeRefreshToken(refreshToken: string) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.AUTH.REFRESH,
    refreshTokenPayloadSchema.parse({ refreshToken }),
  );
  return refreshResponseSchema.parse(data);
}

const sessionRefresher = createSessionRefresher(exchangeRefreshToken);

export function endSession() {
  clearAuthToken();
  markSessionExpired();
  queryClient.clear();
  window.location.assign(ROUTES.LOGIN);
}

function isSessionOver(error: unknown): boolean {
  return error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED;
}

// Access token that is safe to use now, refreshed first when about to expire. Ends the session
// (redirect to login) when the refresh token is rejected, then rethrows.
export async function ensureFreshAccessToken(): Promise<string | null> {
  try {
    return await sessionRefresher.ensureFresh();
  } catch (error) {
    if (isSessionOver(error)) endSession();
    throw error;
  }
}

// Same as above, forced: for a caller whose token was just rejected with 401.
export async function refreshAccessToken(rejectedToken: string | null): Promise<string> {
  try {
    return await sessionRefresher.refresh(rejectedToken);
  } catch (error) {
    if (isSessionOver(error)) endSession();
    throw error;
  }
}

function getBearerToken(error: AxiosError): string | null {
  const header = error.config?.headers.get('Authorization');
  return typeof header === 'string' && header.startsWith(BEARER_PREFIX)
    ? header.slice(BEARER_PREFIX.length)
    : null;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || !error.response) {
      return Promise.reject(new ApiError(NETWORK_ERROR_STATUS, MESSAGES.ERROR_NETWORK));
    }
    const { status, data } = error.response;
    const apiError = new ApiError(status, extractErrorMessage(status, data), data);
    const config = error.config;
    const canRefresh =
      status === HTTP_STATUS.UNAUTHORIZED &&
      config !== undefined &&
      !config.hasRetriedAuth &&
      !PUBLIC_PATHS.includes(config.url ?? '');
    if (!canRefresh) return Promise.reject(apiError);

    try {
      await refreshAccessToken(getBearerToken(error));
    } catch (refreshError) {
      return Promise.reject(isSessionOver(refreshError) ? apiError : refreshError);
    }
    // The request interceptor attaches the new token from storage.
    return apiClient.request({ ...config, hasRetriedAuth: true });
  },
);

// Fire-and-forget DELETE that survives page unload, where an axios request would be cancelled.
export function sendKeepaliveDelete(path: string): void {
  const token = getAuthToken();
  if (!token) return;
  // Best effort during unload: there is nobody left to handle a failure.
  fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method: 'DELETE',
    keepalive: true,
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => undefined);
}
