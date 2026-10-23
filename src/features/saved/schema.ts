import { z } from 'zod';
import { COLLECTION_NAME_MAX_LENGTH, MESSAGES } from '@/constants';

export const collectionPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, MESSAGES.COLLECTION_NAME_REQUIRED)
    .max(COLLECTION_NAME_MAX_LENGTH, MESSAGES.COLLECTION_NAME_TOO_LONG),
});
