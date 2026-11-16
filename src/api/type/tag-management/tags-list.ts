import { z } from 'zod';
import { managedTagSchema } from './shared';

export const managedTagsParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
});

export const managedTagsResponseSchema = z.object({
  tags: z.array(managedTagSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type ManagedTagsParams = z.infer<typeof managedTagsParamsSchema>;
export type ManagedTagsResponse = z.infer<typeof managedTagsResponseSchema>;
