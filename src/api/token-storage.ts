import { AUTH_COOKIE, AUTH_TOKEN_CHANGE_EVENT, SESSION_EXPIRED_KEY } from '@/constants';

function buildCookie(name: string, value: string, maxAge: number) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Strict${secure}`;
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const entry = document.cookie.split('; ').find((part) => part.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}

export function getAuthToken(): string | null {
  return readCookie(AUTH_COOKIE.NAME);
}

export function getRefreshToken(): string | null {
  return readCookie(AUTH_COOKIE.REFRESH_NAME);
}

// Always written as a pair: a refresh token is single-use, so keeping an old one is never right.
export function setAuthTokens({ token, refreshToken }: { token: string; refreshToken: string }) {
  document.cookie = buildCookie(AUTH_COOKIE.NAME, token, AUTH_COOKIE.MAX_AGE_SECONDS);
  document.cookie = buildCookie(
    AUTH_COOKIE.REFRESH_NAME,
    refreshToken,
    AUTH_COOKIE.MAX_AGE_SECONDS,
  );
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGE_EVENT));
}

export function clearAuthToken() {
  document.cookie = buildCookie(AUTH_COOKIE.NAME, '', 0);
  document.cookie = buildCookie(AUTH_COOKIE.REFRESH_NAME, '', 0);
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGE_EVENT));
}

export function markSessionExpired() {
  sessionStorage.setItem(SESSION_EXPIRED_KEY, '1');
}

// Reads and clears the flag so the notice shows once.
export function consumeSessionExpired(): boolean {
  const expired = sessionStorage.getItem(SESSION_EXPIRED_KEY) !== null;
  sessionStorage.removeItem(SESSION_EXPIRED_KEY);
  return expired;
}
