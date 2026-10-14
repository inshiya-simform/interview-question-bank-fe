import { z } from 'zod';

export const questionClientSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const questionSchema = z.object({
  id: z.string(),
  text: z.string(),
  answerNotes: z.string(),
  client: questionClientSchema.nullish(),
  // Tag names grouped by category slug.
  tags: z.record(z.string(), z.array(z.string())),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Question = z.infer<typeof questionSchema>;
