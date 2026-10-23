import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Collection } from '@/api';
import { useRenameCollectionMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';
import { collectionNameError } from '../utils';

export function useCollectionHeader(collection: Collection | undefined) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const renameMutation = useRenameCollectionMutation();

  const rename = async (name: string) => {
    if (!collection) return undefined;
    try {
      await renameMutation.mutateAsync({ id: collection.id, payload: { name } });
      toast.success(MESSAGES.COLLECTION_RENAMED);
      setIsRenaming(false);
      return undefined;
    } catch (error) {
      return collectionNameError(error);
    }
  };

  return {
    isRenaming,
    isDeleteOpen,
    startRenaming: () => setIsRenaming(true),
    stopRenaming: () => setIsRenaming(false),
    openDelete: () => setIsDeleteOpen(true),
    closeDelete: () => setIsDeleteOpen(false),
    rename,
  };
}
