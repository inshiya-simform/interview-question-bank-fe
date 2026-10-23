import { useState } from 'react';
import { toast } from 'react-toastify';
import { MESSAGES } from '@/constants';
import { createCollection } from '../mock/store';

export function useCollectionList(onCreated: (collectionId: string) => void) {
  const [isCreating, setIsCreating] = useState(false);

  const create = (name: string) => {
    const result = createCollection(name);
    if (!result.ok) return result.error;
    toast.success(MESSAGES.COLLECTION_CREATED);
    setIsCreating(false);
    onCreated(result.collection.id);
    return undefined;
  };

  return {
    isCreating,
    startCreating: () => setIsCreating(true),
    stopCreating: () => setIsCreating(false),
    create,
  };
}
