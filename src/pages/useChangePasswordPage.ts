import { toast } from 'react-toastify';
import { useChangePasswordMutation } from '@/api/hooks';
import { ApiError, getErrorMessage } from '@/api/errors';
import { getFieldErrors } from '@/api';
import type { ChangePasswordPayload } from '@/api';
import { CURRENT_PASSWORD_INCORRECT_API_MESSAGE, HTTP_STATUS, MESSAGES } from '@/constants';

function isCurrentPasswordError(error: unknown) {
  return (
    error instanceof ApiError &&
    error.status === HTTP_STATUS.BAD_REQUEST &&
    error.message === CURRENT_PASSWORD_INCORRECT_API_MESSAGE
  );
}

export function useChangePasswordPage() {
  const { mutate, isPending, error } = useChangePasswordMutation();
  const fieldErrors = getFieldErrors(error);
  if (isCurrentPasswordError(error)) fieldErrors.currentPassword ??= getErrorMessage(error);

  const handleSubmit = (values: ChangePasswordPayload, reset: () => void) =>
    mutate(values, {
      onSuccess: () => {
        reset();
        toast.success(MESSAGES.PASSWORD_CHANGED);
      },
    });

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const isRateLimited = error instanceof ApiError && error.status === HTTP_STATUS.TOO_MANY_REQUESTS;
  const errorMessage = (() => {
    if (!error || hasFieldErrors) return undefined;
    return isRateLimited ? MESSAGES.TOO_MANY_ATTEMPTS : getErrorMessage(error);
  })();

  return {
    handleSubmit,
    isPending,
    errorMessage,
    fieldErrors: {
      currentPassword: fieldErrors.currentPassword,
      password: fieldErrors.password,
      confirmPassword: fieldErrors.confirmPassword,
    },
  };
}
