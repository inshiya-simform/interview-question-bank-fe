import { useSyncExternalStore } from 'react';
import type { Collection } from '../types';
import { getSavedState, subscribeSaved } from '../mock/store';

export function useSavedState() {
  const { collections, entries } = useSyncExternalStore(subscribeSaved, getSavedState);
  const withCounts: Collection[] = collections.map((collection) => ({
    ...collection,
    questionCount: entries.filter((entry) => entry.collectionId === collection.id).length,
  }));
  return { collections: withCounts, entries };
}
