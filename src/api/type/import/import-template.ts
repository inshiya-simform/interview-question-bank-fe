import { z } from 'zod';

export const importTemplateSchema = z.object({
  filename: z.string().min(1),
  content: z.string(),
});

export type ImportTemplate = z.infer<typeof importTemplateSchema>;
