import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { collectionListResponseSchema } from '../type/collections/collections-list';
import type { CollectionListResponse } from '../type/collections/collections-list';
import {
  saveQuestionPayloadSchema,
  saveQuestionResponseSchema,
} from '../type/collections/save-question';
import type { SaveQuestionPayload, SaveQuestionResponse } from '../type/collections/save-question';
import {
  savedQuestionListParamsSchema,
  savedQuestionListResponseSchema,
} from '../type/collections/saved-questions';
import type {
  SavedQuestionListParams,
  SavedQuestionListResponse,
} from '../type/collections/saved-questions';
import { collectionPayloadSchema, collectionSchema } from '../type/collections/shared';
import type { Collection, CollectionPayload } from '../type/collections/shared';

export async function getCollections(): Promise<CollectionListResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.COLLECTIONS.BASE);
  return collectionListResponseSchema.parse(data);
}

export async function createCollection(payload: CollectionPayload): Promise<Collection> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.COLLECTIONS.BASE,
    collectionPayloadSchema.parse(payload),
  );
  return collectionSchema.parse(data);
}

export async function renameCollection(
  id: string,
  payload: CollectionPayload,
): Promise<Collection> {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.COLLECTIONS.BY_ID(id),
    collectionPayloadSchema.parse(payload),
  );
  return collectionSchema.parse(data);
}

// 204 with no body.
export async function deleteCollection(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.COLLECTIONS.BY_ID(id));
}

export async function getSavedQuestions(
  params: SavedQuestionListParams = {},
): Promise<SavedQuestionListResponse> {
  const { collectionId, ...rest } = savedQuestionListParamsSchema.parse(params);
  const { data } = await apiClient.get(API_ENDPOINTS.COLLECTIONS.SAVED_QUESTIONS, {
    params: { ...rest, collectionId: collectionId || undefined },
  });
  return savedQuestionListResponseSchema.parse(data);
}

// Saves or moves: the API keeps one collection per question and is idempotent.
export async function saveQuestion(
  questionId: string,
  payload: SaveQuestionPayload,
): Promise<SaveQuestionResponse> {
  const { data } = await apiClient.put(
    API_ENDPOINTS.COLLECTIONS.SAVED_QUESTION(questionId),
    saveQuestionPayloadSchema.parse(payload),
  );
  return saveQuestionResponseSchema.parse(data);
}

// 204 with no body; safe to call when the question is not saved.
export async function unsaveQuestion(questionId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.COLLECTIONS.SAVED_QUESTION(questionId));
}
