import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateCollectionMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';
import { collectionNameError } from '../utils';

export function useCollectionList(onCreated: (collectionId: string) => void) {
  const [isCreating, setIsCreating] = useState(false);
  const createMutation = useCreateCollectionMutation();

  const create = async (name: string) => {
    try {
      const collection = await createMutation.mutateAsync({ name });
      toast.success(MESSAGES.COLLECTION_CREATED);
      setIsCreating(false);
      onCreated(collection.id);
      return undefined;
    } catch (error) {
      return collectionNameError(error);
    }
  };

  return {
    isCreating,
    startCreating: () => setIsCreating(true),
    stopCreating: () => setIsCreating(false),
    create,
  };
}
