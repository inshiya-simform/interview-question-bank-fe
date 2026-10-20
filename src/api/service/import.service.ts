import { IMPORT_CSV_ACCEPT, IMPORT_TEMPLATE_FILENAME } from '@/constants';
import { parseContentDispositionFilename } from '@/utils/contentDisposition';
import { z } from 'zod';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  importQuestionsPayloadSchema,
  importQuestionsResponseSchema,
} from '../type/import/import-questions';
import type {
  ImportQuestionsPayload,
  ImportQuestionsResponse,
} from '../type/import/import-questions';
import { importTemplateSchema } from '../type/import/import-template';
import type { ImportTemplate } from '../type/import/import-template';

const FILE_FIELD = 'file';

export async function importQuestions(
  payload: ImportQuestionsPayload,
): Promise<ImportQuestionsResponse> {
  const { file } = importQuestionsPayloadSchema.parse(payload);
  const body = new FormData();
  body.append(FILE_FIELD, file);
  const { data } = await apiClient.post(API_ENDPOINTS.QUESTIONS.IMPORT, body);
  return importQuestionsResponseSchema.parse(data);
}

export async function getImportTemplate(): Promise<ImportTemplate> {
  const { data, headers } = await apiClient.get(API_ENDPOINTS.QUESTIONS.TEMPLATE, {
    headers: { Accept: IMPORT_CSV_ACCEPT },
    responseType: 'text',
  });
  return importTemplateSchema.parse({
    filename:
      parseContentDispositionFilename(headers['content-disposition']) ?? IMPORT_TEMPLATE_FILENAME,
    content: z.string().parse(data),
  });
}
