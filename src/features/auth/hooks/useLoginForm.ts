import { loginSchema } from '@/api';
import type { LoginPayload } from '@/api';
import { useZodForm } from '@/hooks/useZodForm';

export function useLoginForm(onSubmit?: (payload: LoginPayload) => void) {
  return useZodForm(loginSchema, { email: '', password: '' }, onSubmit);
}
