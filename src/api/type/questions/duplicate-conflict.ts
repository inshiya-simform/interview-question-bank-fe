import { z } from 'zod';
import { DUPLICATE_SUSPECTED_CODE } from '@/constants';
import { duplicateMatchSchema } from './check-duplicate';

export const duplicateConflictBodySchema = z.looseObject({
  error: z.looseObject({
    code: z.literal(DUPLICATE_SUSPECTED_CODE),
    details: z.looseObject({ matches: z.array(duplicateMatchSchema) }),
  }),
});

export type DuplicateConflictBody = z.infer<typeof duplicateConflictBodySchema>;
