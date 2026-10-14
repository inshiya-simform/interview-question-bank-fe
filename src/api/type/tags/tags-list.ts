import { z } from 'zod';

export const tagSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});

export const tagCategorySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  tags: z.array(tagSchema),
});

export const tagListResponseSchema = z.object({
  categories: z.array(tagCategorySchema),
});

export type Tag = z.infer<typeof tagSchema>;
export type TagCategory = z.infer<typeof tagCategorySchema>;
export type TagListResponse = z.infer<typeof tagListResponseSchema>;
