import { HTTP_STATUS } from '@/constants';
import { ApiError } from './errors';
import { duplicateConflictBodySchema } from './type/questions/duplicate-conflict';
import type { DuplicateMatch } from './type/questions/check-duplicate';

// Narrowing helper, not drift handling: any other 409 is simply not a duplicate conflict.
export function parseDuplicateConflict(error: unknown): DuplicateMatch[] | undefined {
  if (!(error instanceof ApiError) || error.status !== HTTP_STATUS.CONFLICT) return undefined;
  const parsed = duplicateConflictBodySchema.safeParse(error.body);
  return parsed.success ? parsed.data.error.details.matches : undefined;
}
