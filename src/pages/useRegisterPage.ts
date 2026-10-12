import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@/api/hooks';
import type { RegisterPayload } from '@/api';
import { ROUTES } from '@/constants';

export function useRegisterPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegisterMutation();

  const handleSubmit = (payload: RegisterPayload) =>
    mutate(payload, { onSuccess: () => navigate(ROUTES.HOME, { replace: true }) });

  return { handleSubmit, isPending };
}
