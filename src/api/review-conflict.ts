import { HTTP_STATUS } from '@/constants';
import { ApiError } from './errors';
import { reviewConflictBodySchema } from './type/reviews/review-conflict';
import type { ReviewConflictDetails } from './type/reviews/review-conflict';

// Narrowing helper, not drift handling: any non-review 409 (or unknown reason) is simply not ours.
export function parseReviewConflict(error: unknown): ReviewConflictDetails | undefined {
  if (!(error instanceof ApiError) || error.status !== HTTP_STATUS.CONFLICT) return undefined;
  const parsed = reviewConflictBodySchema.safeParse(error.body);
  return parsed.success ? parsed.data.error.details : undefined;
}
