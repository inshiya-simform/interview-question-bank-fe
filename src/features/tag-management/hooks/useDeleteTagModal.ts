import { toast } from 'react-toastify';
import type { ManagedTag } from '@/api';
import { getErrorMessage } from '@/api/errors';
import { useDeleteManagedTagMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';
import { isConflictError } from '../errors';

interface UseDeleteTagModalArgs {
  tag: ManagedTag;
  onClose: () => void;
  onBlocked: (name: string) => void;
}

export function useDeleteTagModal({ tag, onClose, onBlocked }: UseDeleteTagModalArgs) {
  const { mutate, isPending } = useDeleteManagedTagMutation();

  return {
    isPending,
    confirm: () =>
      mutate(tag.id, {
        onSuccess: () => {
          toast.success(MESSAGES.TAG_DELETED);
          onClose();
        },
        // A question started using the tag since the list loaded.
        onError: (error) =>
          isConflictError(error) ? onBlocked(tag.name) : toast.error(getErrorMessage(error)),
      }),
  };
}
