import { joinCsv } from '@/utils/csv';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  createQuestionPayloadSchema,
  createQuestionResponseSchema,
} from '../type/questions/create-question';
import {
  questionListParamsSchema,
  questionListResponseSchema,
} from '../type/questions/questions-list';
import type { QuestionListParams, QuestionListResponse } from '../type/questions/questions-list';
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

export async function getQuestions(params: QuestionListParams = {}): Promise<QuestionListResponse> {
  const { tags, categories, ...rest } = questionListParamsSchema.parse(params);
  const { data } = await apiClient.get(API_ENDPOINTS.QUESTIONS.BASE, {
    params: {
      ...rest,
      tags: tags?.length ? joinCsv(tags) : undefined,
      categories: categories?.length ? joinCsv(categories) : undefined,
      search: rest.search || undefined,
    },
  });
  return questionListResponseSchema.parse(data);
}
