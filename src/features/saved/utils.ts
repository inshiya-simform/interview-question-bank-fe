import { toast } from 'react-toastify';
import { ApiError, getErrorMessage } from '@/api/errors';
import { HTTP_STATUS, MESSAGES } from '@/constants';

// 409 means the name is taken or the collection limit was hit; the form shows it inline.
// Any other failure is not tied to a field, so it is toasted here (the mutation is marked silent).
export function collectionNameError(error: unknown): string | undefined {
  if (error instanceof ApiError && error.status === HTTP_STATUS.CONFLICT) {
    return MESSAGES.COLLECTION_NAME_TAKEN;
  }
  toast.error(getErrorMessage(error));
  return undefined;
}
