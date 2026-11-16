import { z } from 'zod';
import { managedCategorySchema } from './shared';

// Outbound query params: validated before sending.
export const tagCategoriesParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  unused: z.boolean().optional(),
});

export const tagCategoriesResponseSchema = z.object({
  categories: z.array(managedCategorySchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type TagCategoriesParams = z.infer<typeof tagCategoriesParamsSchema>;
export type TagCategoriesResponse = z.infer<typeof tagCategoriesResponseSchema>;
