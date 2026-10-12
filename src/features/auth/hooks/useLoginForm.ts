import { loginSchema } from '@/api/auth/types/auth.types';
import type { LoginPayload } from '@/api/auth/types/auth.types';
import { useZodForm } from '@/hooks/useZodForm';

export function useLoginForm(onSubmit?: (payload: LoginPayload) => void) {
  return useZodForm(loginSchema, { email: '', password: '' }, onSubmit);
}
