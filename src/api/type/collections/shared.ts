import { z } from 'zod';
import { COLLECTION_NAME_MAX_LENGTH, MESSAGES } from '@/constants';

export const collectionRefSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const collectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Shared by create and rename: the API trims and enforces 1-60 characters.
export const collectionPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, MESSAGES.COLLECTION_NAME_REQUIRED)
    .max(COLLECTION_NAME_MAX_LENGTH, MESSAGES.COLLECTION_NAME_TOO_LONG),
});

export type CollectionRef = z.infer<typeof collectionRefSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type CollectionPayload = z.infer<typeof collectionPayloadSchema>;
