import { useSyncExternalStore } from 'react';
import { getSnapshot, subscribe } from '../mock/reviewStore';

// MOCK: swap for the real queries once the review endpoints exist.
export function useSubmissions() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
