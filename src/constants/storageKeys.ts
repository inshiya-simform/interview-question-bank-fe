// Both cookies live as long as the refresh token (6 months): an expired access token is renewed
// from the refresh token, so it must still be readable when the user returns after a long break.
export const AUTH_COOKIE = {
  NAME: 'iqb_token',
  REFRESH_NAME: 'iqb_refresh_token',
  MAX_AGE_SECONDS: 60 * 60 * 24 * 180,
} as const;

// Web Lock held while exchanging a refresh token, so only one tab rotates it at a time.
export const AUTH_REFRESH_LOCK_NAME = 'iqb:auth-refresh';

// Survives the full-page redirect to /login so the login screen can explain why the user landed there.
export const SESSION_EXPIRED_KEY = 'iqb_session_expired';

// Same-tab signal fired when the stored token is set or cleared (cookies emit no event).
export const AUTH_TOKEN_CHANGE_EVENT = 'iqb:auth-token-change';
