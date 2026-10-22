import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useResetPasswordMutation, useVerifyResetTokenQuery } from '@/api/hooks';
import { ApiError, getErrorMessage } from '@/api/errors';
import { getFieldErrors, resetPasswordSearchParamsSchema } from '@/api';
import type { ResetPasswordFormValues } from '@/api';
import {
  HTTP_STATUS,
  MESSAGES,
  RESET_LINK_INVALID_API_MESSAGE,
  RESET_PASSWORD_SEARCH_PARAMS,
  ROUTES,
} from '@/constants';

export type ResetPasswordView = 'invalid' | 'loading' | 'rate-limited' | 'error' | 'form';

function hasStatus(error: unknown, status: number) {
  return error instanceof ApiError && error.status === status;
}

function isInvalidLink(error: unknown) {
  return (
    hasStatus(error, HTTP_STATUS.BAD_REQUEST) &&
    error instanceof ApiError &&
    error.message === RESET_LINK_INVALID_API_MESSAGE
  );
}

function resolveView(
  token: string | undefined,
  verify: ReturnType<typeof useVerifyResetTokenQuery>,
  resetError: unknown,
): ResetPasswordView {
  // No token: nothing to verify, so no API call is made.
  if (!token || isInvalidLink(resetError)) return 'invalid';
  if (verify.isError) {
    if (hasStatus(verify.error, HTTP_STATUS.TOO_MANY_REQUESTS)) return 'rate-limited';
    return hasStatus(verify.error, HTTP_STATUS.BAD_REQUEST) ? 'invalid' : 'error';
  }
  return verify.isSuccess ? 'form' : 'loading';
}

function describeSubmitError(error: unknown, hasFieldErrors: boolean) {
  if (!error || hasFieldErrors) return undefined;
  if (hasStatus(error, HTTP_STATUS.TOO_MANY_REQUESTS)) return MESSAGES.TOO_MANY_ATTEMPTS;
  return getErrorMessage(error);
}

export function useResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parsed = resetPasswordSearchParamsSchema.safeParse({
    token: searchParams.get(RESET_PASSWORD_SEARCH_PARAMS.TOKEN) ?? undefined,
  });
  const token = parsed.success ? parsed.data.token : undefined;

  const verify = useVerifyResetTokenQuery(token);
  const { mutate, isPending, error } = useResetPasswordMutation();

  const fieldErrors = getFieldErrors(error);
  const view = resolveView(token, verify, error);

  const handleSubmit = ({ password, confirmPassword }: ResetPasswordFormValues) => {
    if (!token) return;
    mutate(
      { token, password, confirmPassword },
      {
        onSuccess: () => {
          toast.success(MESSAGES.PASSWORD_RESET_SUCCESS);
          // Replace so the token-bearing URL does not stay in history.
          navigate(ROUTES.LOGIN, { replace: true });
        },
      },
    );
  };

  return {
    view,
    handleSubmit,
    isPending,
    fieldErrors: { password: fieldErrors.password, confirmPassword: fieldErrors.confirmPassword },
    errorMessage: describeSubmitError(error, Object.keys(fieldErrors).length > 0),
    verifyErrorMessage: verify.error ? getErrorMessage(verify.error) : MESSAGES.ERROR_UNKNOWN,
  };
}
