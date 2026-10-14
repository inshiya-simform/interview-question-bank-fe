import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  createQuestionPayloadSchema,
  createQuestionResponseSchema,
} from '../type/questions/create-question';
import type {
  CreateQuestionPayload,
  CreateQuestionResponse,
} from '../type/questions/create-question';

export async function createQuestion(
  payload: CreateQuestionPayload,
): Promise<CreateQuestionResponse> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.QUESTIONS.BASE,
    createQuestionPayloadSchema.parse(payload),
  );
  return createQuestionResponseSchema.parse(data);
}
