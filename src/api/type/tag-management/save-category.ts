import { z } from 'zod';
import { CATEGORY_DESCRIPTION_MAX_LENGTH, MESSAGES, NAME_MAX_LENGTH } from '@/constants';

// Used for both create and edit; every form value is a string so it fits `useZodForm`.
export const saveCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, MESSAGES.NAME_REQUIRED)
    .max(NAME_MAX_LENGTH, MESSAGES.NAME_TOO_LONG),
  description: z
    .string()
    .trim()
    .max(CATEGORY_DESCRIPTION_MAX_LENGTH, MESSAGES.CATEGORY_DESCRIPTION_TOO_LONG),
});

export type SaveCategoryPayload = z.infer<typeof saveCategorySchema>;
