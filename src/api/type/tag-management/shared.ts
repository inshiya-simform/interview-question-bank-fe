import { z } from 'zod';

// Admin views carry usage counts so the UI can lock deletes; the API still enforces them.
export const managedCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().default(null),
  tagCount: z.number(),
  questionCount: z.number(),
});

export const managedTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  questionCount: z.number(),
});

export type ManagedCategory = z.infer<typeof managedCategorySchema>;
export type ManagedTag = z.infer<typeof managedTagSchema>;
