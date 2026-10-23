import { toast } from 'react-toastify';
import type { Collection } from '@/api';
import { useDeleteCollectionMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';

interface UseDeleteCollectionModalArgs {
  collection: Collection;
  onClose: () => void;
  onDeleted: () => void;
}

export function useDeleteCollectionModal({
  collection,
  onClose,
  onDeleted,
}: UseDeleteCollectionModalArgs) {
  const { mutate, isPending } = useDeleteCollectionMutation();

  return {
    isPending,
    confirm: () =>
      mutate(collection.id, {
        onSuccess: () => {
          toast.success(MESSAGES.COLLECTION_DELETED);
          onClose();
          onDeleted();
        },
      }),
  };
}
