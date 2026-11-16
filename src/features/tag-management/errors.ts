import { ApiError } from '@/api/errors';
import { HTTP_STATUS } from '@/constants';

export function isConflictError(error: unknown): boolean {
  return error instanceof ApiError && error.status === HTTP_STATUS.CONFLICT;
}
