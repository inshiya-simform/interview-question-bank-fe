import { useState } from 'react';
import { toast } from 'react-toastify';
import { MESSAGES } from '@/constants';
import { renameCollection } from '../mock/store';
import type { Collection } from '../types';

export function useCollectionHeader(collection: Collection | undefined) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const rename = (name: string) => {
    if (!collection) return undefined;
    const result = renameCollection(collection.id, name);
    if (!result.ok) return result.error;
    toast.success(MESSAGES.COLLECTION_RENAMED);
    setIsRenaming(false);
    return undefined;
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
