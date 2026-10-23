import type { Question } from '@/api';
import { MESSAGES } from '@/constants';
import type { CollectionResult, SavedEntry } from '../types';
import { SEED_COLLECTIONS, SEED_ENTRIES } from './seed';

// Local stand-in for server state while the collections API doesn't exist: it lives in memory,
// resets on reload and is shared by everything in this tab. Replace it with API hooks later.
interface StoredCollection {
  id: string;
  name: string;
}

interface SavedState {
  collections: readonly StoredCollection[];
  entries: readonly SavedEntry[];
}

let state: SavedState = { collections: SEED_COLLECTIONS, entries: SEED_ENTRIES };
const listeners = new Set<() => void>();

function setState(next: SavedState) {
  state = next;
  listeners.forEach((listener) => listener());
}

export const getSavedState = () => state;

export function subscribeSaved(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const normalise = (name: string) => name.trim().toLowerCase();

const isNameTaken = (name: string, exceptId?: string) =>
  state.collections.some(
    (collection) => collection.id !== exceptId && normalise(collection.name) === normalise(name),
  );

export function createCollection(name: string): CollectionResult {
  if (isNameTaken(name)) return { ok: false, error: MESSAGES.COLLECTION_NAME_TAKEN };
  const collection = { id: crypto.randomUUID(), name };
  setState({ ...state, collections: [...state.collections, collection] });
  return { ok: true, collection };
}

export function renameCollection(id: string, name: string): CollectionResult {
  if (isNameTaken(name, id)) return { ok: false, error: MESSAGES.COLLECTION_NAME_TAKEN };
  const collection = { id, name };
  setState({
    ...state,
    collections: state.collections.map((current) => (current.id === id ? collection : current)),
  });
  return { ok: true, collection };
}

// Deleting a collection unsaves its questions; the questions themselves are untouched.
export function deleteCollection(id: string) {
  setState({
    collections: state.collections.filter((collection) => collection.id !== id),
    entries: state.entries.filter((entry) => entry.collectionId !== id),
  });
}

// Saving and moving are the same action: it replaces the question's existing entry.
export function saveQuestion(question: Question, collectionId: string) {
  setState({
    ...state,
    entries: [
      ...state.entries.filter((entry) => entry.question.id !== question.id),
      { question, collectionId, savedAt: Date.now() },
    ],
  });
}

export function unsaveQuestion(questionId: string) {
  setState({
    ...state,
    entries: state.entries.filter((entry) => entry.question.id !== questionId),
  });
}
