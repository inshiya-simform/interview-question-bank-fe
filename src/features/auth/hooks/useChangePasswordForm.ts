import { changePasswordSchema } from '@/api';
import type { ChangePasswordPayload } from '@/api';
import { useZodForm } from '@/hooks/useZodForm';

type FieldErrors = Partial<Record<keyof ChangePasswordPayload, string>>;

export function useChangePasswordForm(
  onSubmit?: (values: ChangePasswordPayload, reset: () => void) => void,
  serverErrors: FieldErrors = {},
) {
  const form = useZodForm(
    changePasswordSchema,
    { currentPassword: '', password: '', confirmPassword: '' },
    onSubmit,
  );
  const errors = {
    currentPassword: form.errors.currentPassword ?? serverErrors.currentPassword,
    password: form.errors.password ?? serverErrors.password,
    confirmPassword: form.errors.confirmPassword ?? serverErrors.confirmPassword,
  };
  return { ...form, errors };
}
