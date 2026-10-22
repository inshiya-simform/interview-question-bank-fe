import { forgotPasswordSchema } from '@/api';
import type { ForgotPasswordPayload } from '@/api';
import { useZodForm } from '@/hooks/useZodForm';

export function useForgotPasswordForm(
  onSubmit?: (payload: ForgotPasswordPayload) => void,
  serverEmailError?: string,
) {
  const form = useZodForm(forgotPasswordSchema, { email: '' }, onSubmit);
  return { ...form, errors: { email: form.errors.email ?? serverEmailError } };
}
