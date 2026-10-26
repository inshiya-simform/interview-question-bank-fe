import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation } from '@/api/hooks';
import { consumeSessionExpired } from '@/api';
import type { LoginPayload } from '@/api';
import { MESSAGES, ROUTES } from '@/constants';

export function useLoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useLoginMutation();

  useEffect(() => {
    if (consumeSessionExpired()) toast.error(MESSAGES.SESSION_EXPIRED);
  }, []);

  const handleSubmit = (payload: LoginPayload) =>
    mutate(payload, { onSuccess: () => navigate(ROUTES.HOME, { replace: true }) });

  return { handleSubmit, isPending };
}
