import { registerFormSchema } from '@/api';
import type { RegisterPayload } from '@/api';
import { useZodForm } from '@/hooks/useZodForm';

export function useRegisterForm(onSubmit?: (payload: RegisterPayload) => void) {
  return useZodForm(
    registerFormSchema,
    { name: '', email: '', password: '', confirmPassword: '' },
    ({ name, email, password }) => onSubmit?.({ name, email, password }),
  );
}
