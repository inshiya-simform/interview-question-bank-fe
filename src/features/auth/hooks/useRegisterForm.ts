import { registerSchema } from '@/api/auth/types/auth.types';
import type { RegisterPayload } from '@/api/auth/types/auth.types';
import { useZodForm } from '@/hooks/useZodForm';

export function useRegisterForm(onSubmit?: (payload: RegisterPayload) => void) {
  return useZodForm(registerSchema, { name: '', email: '', password: '' }, onSubmit);
}
