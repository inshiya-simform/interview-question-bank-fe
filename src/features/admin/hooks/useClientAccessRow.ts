import { useState } from 'react';
import { toast } from 'react-toastify';
import type { ClientAccess } from '@/api';
import { useGrantClientAccessMutation, useRevokeClientAccessMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';

export function useClientAccessRow(client: ClientAccess) {
  const [isAdding, setIsAdding] = useState(false);
  const grant = useGrantClientAccessMutation();
  const revoke = useRevokeClientAccessMutation();

  const onSuccess = () => toast.success(MESSAGES.CLIENT_ACCESS_UPDATED);

  const addUser = (email: string) =>
    grant.mutate(
      { clientId: client.id, email },
      {
        onSuccess: () => {
          onSuccess();
          setIsAdding(false);
        },
      },
    );

  const removeUser = (userId: string) =>
    revoke.mutate({ clientId: client.id, userId }, { onSuccess });

  return {
    isAdding,
    isPending: grant.isPending || revoke.isPending,
    isGranting: grant.isPending,
    openAdd: () => setIsAdding(true),
    closeAdd: () => setIsAdding(false),
    addUser,
    removeUser,
  };
}
