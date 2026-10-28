import { AUTH_COOKIE, AUTH_TOKEN_CHANGE_EVENT, SESSION_EXPIRED_KEY } from '@/constants';

const PREFIX = `${AUTH_COOKIE.NAME}=`;

function buildCookie(value: string, maxAge: number) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  return `${PREFIX}${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Strict${secure}`;
}

export function getAuthToken(): string | null {
  const entry = document.cookie.split('; ').find((part) => part.startsWith(PREFIX));
  return entry ? decodeURIComponent(entry.slice(PREFIX.length)) : null;
}

export function setAuthToken(token: string) {
  document.cookie = buildCookie(token, AUTH_COOKIE.MAX_AGE_SECONDS);
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGE_EVENT));
}

export function clearAuthToken() {
  document.cookie = buildCookie('', 0);
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
