import { useForgotPasswordMutation } from '@/api/hooks';
import { ApiError, getErrorMessage } from '@/api/errors';
import { getFieldErrors } from '@/api';
import type { ForgotPasswordPayload } from '@/api';
import { HTTP_STATUS, MESSAGES } from '@/constants';

function describeError(error: unknown, emailError: string | undefined) {
  if (!error) return undefined;
  if (error instanceof ApiError && error.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
    return MESSAGES.TOO_MANY_ATTEMPTS;
  }
  // A field-level 400 is shown on the input instead of in the banner.
  return emailError ? undefined : getErrorMessage(error);
}

export function useForgotPasswordPage() {
  const { mutate, isPending, isSuccess, data, error } = useForgotPasswordMutation();

  const emailError = getFieldErrors(error).email;
  const handleSubmit = (payload: ForgotPasswordPayload) => mutate(payload);

  return {
    handleSubmit,
    isPending,
    // Same generic message for every address, so the UI never reveals whether one exists.
    sentMessage: isSuccess ? data.message : undefined,
    errorMessage: describeError(error, emailError),
    emailError,
  };
}
