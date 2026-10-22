import { z } from 'zod';
import { EXPORT_FILENAME, IMPORT_CSV_ACCEPT } from '@/constants';
import { parseContentDispositionFilename } from '@/utils/contentDisposition';
import { joinCsv } from '@/utils/csv';
import { apiClient, sendKeepaliveDelete } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  checkDuplicatePayloadSchema,
  checkDuplicateResponseSchema,
} from '../type/questions/check-duplicate';
import type {
  CheckDuplicatePayload,
  CheckDuplicateResponse,
} from '../type/questions/check-duplicate';
import {
  createQuestionPayloadSchema,
  createQuestionResponseSchema,
} from '../type/questions/create-question';
import { exportFileSchema, exportQuestionsParamsSchema } from '../type/questions/export-questions';
import type { ExportFile, ExportQuestionsParams } from '../type/questions/export-questions';
import {
  questionListParamsSchema,
  questionListResponseSchema,
} from '../type/questions/questions-list';
import { questionSchema } from '../type/questions/shared';
import { questionCountsResponseSchema } from '../type/reviews/question-counts';
import type { QuestionCountsResponse } from '../type/reviews/question-counts';
import { questionHistoryResponseSchema } from '../type/reviews/question-history';
import type { QuestionHistoryResponse } from '../type/reviews/question-history';
import {
  bulkApprovePayloadSchema,
  bulkDecisionResponseSchema,
  bulkRejectPayloadSchema,
} from '../type/reviews/bulk-decision';
import type {
  BulkApprovePayload,
  BulkDecisionResponse,
  BulkRejectPayload,
} from '../type/reviews/bulk-decision';
import {
  approvePayloadSchema,
  rejectPayloadSchema,
  requestChangesPayloadSchema,
} from '../type/reviews/review-decision';
import type {
  ApprovePayload,
  RejectPayload,
  RequestChangesPayload,
} from '../type/reviews/review-decision';
import { reviewStateSchema } from '../type/reviews/review-state';
import type { ReviewState } from '../type/reviews/review-state';
import {
  submissionListParamsSchema,
  submissionListResponseSchema,
} from '../type/reviews/submission-list';
import type { SubmissionListParams, SubmissionListResponse } from '../type/reviews/submission-list';
import { reviewedQuestionSchema } from '../type/reviews/reviewed-question';
import type { ReviewedQuestion } from '../type/reviews/reviewed-question';
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

export async function exportQuestions(params: ExportQuestionsParams = {}): Promise<ExportFile> {
  const { tags, categories, ...rest } = exportQuestionsParamsSchema.parse(params);
  const { data, headers } = await apiClient.get(API_ENDPOINTS.QUESTIONS.EXPORT, {
    headers: { Accept: IMPORT_CSV_ACCEPT },
    responseType: 'text',
    params: {
      ...rest,
      tags: tags?.length ? joinCsv(tags) : undefined,
      categories: categories?.length ? joinCsv(categories) : undefined,
      search: rest.search || undefined,
    },
  });
  return exportFileSchema.parse({
    filename: parseContentDispositionFilename(headers['content-disposition']) ?? EXPORT_FILENAME,
    content: z.string().parse(data),
  });
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

export async function checkDuplicateQuestion(
  payload: CheckDuplicatePayload,
): Promise<CheckDuplicateResponse> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.QUESTIONS.CHECK_DUPLICATE,
    checkDuplicatePayloadSchema.parse(payload),
  );
  return checkDuplicateResponseSchema.parse(data);
}

export async function getQuestionCounts(): Promise<QuestionCountsResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.QUESTIONS.COUNTS);
  return questionCountsResponseSchema.parse(data);
}

export async function getSubmissions(
  params: SubmissionListParams = {},
): Promise<SubmissionListResponse> {
  const { status, ...rest } = submissionListParamsSchema.parse(params);
  const { data } = await apiClient.get(API_ENDPOINTS.QUESTIONS.SUBMISSIONS, {
    params: { ...rest, status: status?.length ? joinCsv(status) : undefined },
  });
  return submissionListResponseSchema.parse(data);
}

export async function getQuestionHistory(id: string): Promise<QuestionHistoryResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.QUESTIONS.HISTORY(id));
  return questionHistoryResponseSchema.parse(data);
}

export async function approveQuestion(
  id: string,
  payload: ApprovePayload,
): Promise<ReviewedQuestion> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.QUESTIONS.APPROVE(id),
    approvePayloadSchema.parse(payload),
  );
  return reviewedQuestionSchema.parse(data);
}

export async function requestQuestionChanges(
  id: string,
  payload: RequestChangesPayload,
): Promise<ReviewedQuestion> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.QUESTIONS.REQUEST_CHANGES(id),
    requestChangesPayloadSchema.parse(payload),
  );
  return reviewedQuestionSchema.parse(data);
}

export async function rejectQuestion(
  id: string,
  payload: RejectPayload,
): Promise<ReviewedQuestion> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.QUESTIONS.REJECT(id),
    rejectPayloadSchema.parse(payload),
  );
  return reviewedQuestionSchema.parse(data);
}

export async function bulkApproveQuestions(
  payload: BulkApprovePayload,
): Promise<BulkDecisionResponse> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.QUESTIONS.BULK_APPROVE,
    bulkApprovePayloadSchema.parse(payload),
  );
  return bulkDecisionResponseSchema.parse(data);
}

export async function bulkRejectQuestions(
  payload: BulkRejectPayload,
): Promise<BulkDecisionResponse> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.QUESTIONS.BULK_REJECT,
    bulkRejectPayloadSchema.parse(payload),
  );
  return bulkDecisionResponseSchema.parse(data);
}

export async function getReviewState(id: string): Promise<ReviewState> {
  const { data } = await apiClient.get(API_ENDPOINTS.QUESTIONS.REVIEW_STATE(id));
  return reviewStateSchema.parse(data);
}

// Claims the lock, or extends it when already held; either way the API returns the current state.
export async function claimReviewLock(id: string): Promise<ReviewState> {
  const { data } = await apiClient.post(API_ENDPOINTS.QUESTIONS.REVIEW_LOCK(id), {});
  return reviewStateSchema.parse(data);
}

// 204 with no body; safe to call when the lock is not held.
export async function releaseReviewLock(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.QUESTIONS.REVIEW_LOCK(id));
}

export function releaseReviewLockKeepalive(id: string): void {
  sendKeepaliveDelete(API_ENDPOINTS.QUESTIONS.REVIEW_LOCK(id));
}
