import { z } from 'zod';
import { collectionSchema } from './shared';

export const collectionListResponseSchema = z.object({
  collections: z.array(collectionSchema),
  totalSaved: z.number(),
});

export type CollectionListResponse = z.infer<typeof collectionListResponseSchema>;
