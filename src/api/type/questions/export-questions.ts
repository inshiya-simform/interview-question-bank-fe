import { z } from 'zod';
import { questionListParamsSchema } from './questions-list';

// The export covers every match for the filters, so pagination is not sent.
export const exportQuestionsParamsSchema = questionListParamsSchema.omit({
  page: true,
  limit: true,
});

export const exportFileSchema = z.object({
  filename: z.string().min(1),
  content: z.string(),
});

export type ExportQuestionsParams = z.infer<typeof exportQuestionsParamsSchema>;
export type ExportFile = z.infer<typeof exportFileSchema>;
