// Refresh the access token this long before its `exp` claim.
export const ACCESS_TOKEN_REFRESH_LEAD_MS = 60_000;

// Logout is best effort; never keep the user waiting on a slow network.
export const LOGOUT_REQUEST_TIMEOUT_MS = 5_000;

export const BEARER_PREFIX = 'Bearer ';
