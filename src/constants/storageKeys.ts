export const AUTH_COOKIE = {
  NAME: 'iqb_token',
  MAX_AGE_SECONDS: 60 * 60 * 24,
} as const;

// Survives the full-page redirect to /login so the login screen can explain why the user landed there.
export const SESSION_EXPIRED_KEY = 'iqb_session_expired';

// Same-tab signal fired when the stored token is set or cleared (cookies emit no event).
export const AUTH_TOKEN_CHANGE_EVENT = 'iqb:auth-token-change';
