import { registerSchema } from '@/api';
import type { RegisterPayload } from '@/api';
import { useZodForm } from '@/hooks/useZodForm';

export function useRegisterForm(onSubmit?: (payload: RegisterPayload) => void) {
  return useZodForm(registerSchema, { name: '', email: '', password: '' }, onSubmit);
}
