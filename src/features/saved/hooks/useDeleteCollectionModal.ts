import { toast } from 'react-toastify';
import { MESSAGES } from '@/constants';
import { deleteCollection } from '../mock/store';
import type { Collection } from '../types';

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
  return {
    confirm: () => {
      deleteCollection(collection.id);
      toast.success(MESSAGES.COLLECTION_DELETED);
      onClose();
      onDeleted();
    },
  };
}
