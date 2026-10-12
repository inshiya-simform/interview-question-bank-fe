import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/api/hooks';
import type { LoginPayload } from '@/api';
import { ROUTES } from '@/constants';

export function useLoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useLoginMutation();

  const handleSubmit = (payload: LoginPayload) =>
    mutate(payload, { onSuccess: () => navigate(ROUTES.HOME, { replace: true }) });

  return { handleSubmit, isPending };
}
