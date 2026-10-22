import { resetPasswordFormSchema } from '@/api';
import type { ResetPasswordFormValues } from '@/api';
import { useZodForm } from '@/hooks/useZodForm';

export function useResetPasswordForm(
  onSubmit?: (values: ResetPasswordFormValues) => void,
  serverErrors: Partial<Record<keyof ResetPasswordFormValues, string>> = {},
) {
  const form = useZodForm(resetPasswordFormSchema, { password: '', confirmPassword: '' }, onSubmit);
  const errors = {
    password: form.errors.password ?? serverErrors.password,
    confirmPassword: form.errors.confirmPassword ?? serverErrors.confirmPassword,
  };
  return { ...form, errors };
}
