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
import { questionSchema } from '../type/questions/shared';
import {
  updateQuestionPayloadSchema,
  updateQuestionResponseSchema,
} from '../type/questions/update-question';
import type {
  UpdateQuestionPayload,
  UpdateQuestionResponse,
} from '../type/questions/update-question';
import type { Question } from '../type/questions/shared';
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

export async function getQuestion(id: string): Promise<Question> {
  const { data } = await apiClient.get(API_ENDPOINTS.QUESTIONS.BY_ID(id));
  return questionSchema.parse(data);
}

export async function updateQuestion(
  id: string,
  payload: UpdateQuestionPayload,
): Promise<UpdateQuestionResponse> {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.QUESTIONS.BY_ID(id),
    updateQuestionPayloadSchema.parse(payload),
  );
  return updateQuestionResponseSchema.parse(data);
}
