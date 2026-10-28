import { useSyncExternalStore } from 'react';
import { getAuthToken } from '@/api/token-storage';
import { AUTH_TOKEN_CHANGE_EVENT } from '@/constants';

function subscribe(onChange: () => void) {
  window.addEventListener(AUTH_TOKEN_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(AUTH_TOKEN_CHANGE_EVENT, onChange);
}

// Re-renders when the stored token changes, e.g. after a password change issues a new one.
export function useAuthToken(): string | null {
  return useSyncExternalStore(subscribe, getAuthToken);
}
