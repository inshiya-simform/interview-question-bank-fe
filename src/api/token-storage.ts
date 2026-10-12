import { AUTH_COOKIE } from '@/constants';

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
}

export function clearAuthToken() {
  document.cookie = buildCookie('', 0);
}
