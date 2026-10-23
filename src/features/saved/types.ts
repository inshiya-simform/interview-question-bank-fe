import type { Question } from '@/api';

export interface Collection {
  id: string;
  name: string;
  questionCount: number;
}

// A saved question lives in exactly one collection; the snapshot is what the Saved page renders.
export interface SavedEntry {
  question: Question;
  collectionId: string;
  savedAt: number;
}

export type CollectionResult =
  { ok: true; collection: Pick<Collection, 'id' | 'name'> } | { ok: false; error: string };
