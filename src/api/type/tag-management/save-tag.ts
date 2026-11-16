import { z } from 'zod';
import { MESSAGES, NAME_MAX_LENGTH } from '@/constants';

// Used for add and rename.
export const saveTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, MESSAGES.NAME_REQUIRED)
    .max(NAME_MAX_LENGTH, MESSAGES.NAME_TOO_LONG),
});

export const moveTagSchema = z.object({
  categoryId: z.number().int().min(1, MESSAGES.CATEGORY_REQUIRED),
});

export type SaveTagPayload = z.infer<typeof saveTagSchema>;
export type MoveTagPayload = z.infer<typeof moveTagSchema>;
