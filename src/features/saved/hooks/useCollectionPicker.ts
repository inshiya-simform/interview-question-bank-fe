import { useId, useState } from 'react';
import { toast } from 'react-toastify';
import type { Question } from '@/api';
import {
  useCreateCollectionMutation,
  useSaveQuestionMutation,
  useUnsaveQuestionMutation,
} from '@/api/hooks';
import { MESSAGES } from '@/constants';
import { collectionNameError } from '../utils';
import { useSavedState } from './useSavedState';

interface UseCollectionPickerArgs {
  question: Pick<Question, 'id'>;
  currentCollectionId?: string;
  onDone: () => void;
}

export function useCollectionPicker({
  question,
  currentCollectionId,
  onDone,
}: UseCollectionPickerArgs) {
  const { collections, isLoading, isError, refetch } = useSavedState();
  const [isCreating, setIsCreating] = useState(false);
  const groupName = useId();
  const saveMutation = useSaveQuestionMutation();
  const unsaveMutation = useUnsaveQuestionMutation();
  const createMutation = useCreateCollectionMutation();
  const isMove = currentCollectionId !== undefined;

  const saveInto = (collection: { id: string; name: string }) =>
    saveMutation.mutate(
      { questionId: question.id, collectionId: collection.id },
      {
        onSuccess: () => {
          toast.success(
            isMove
              ? MESSAGES.QUESTION_MOVED(collection.name)
              : MESSAGES.QUESTION_SAVED(collection.name),
          );
          onDone();
        },
      },
    );

  const select = (collection: { id: string; name: string }) => {
    if (collection.id !== currentCollectionId) saveInto(collection);
  };

  const remove = () =>
    unsaveMutation.mutate(question.id, {
      onSuccess: () => {
        toast.success(MESSAGES.QUESTION_UNSAVED);
        onDone();
      },
    });

  // Create then save; a failed save is toasted centrally and leaves the new collection in place.
  const createAndSave = async (name: string) => {
    try {
      const collection = await createMutation.mutateAsync({ name });
      saveInto(collection);
      return undefined;
    } catch (error) {
      return collectionNameError(error);
    }
  };

  return {
    collections,
    isLoading,
    isError,
    refetch,
    isPending: saveMutation.isPending || unsaveMutation.isPending,
    groupName,
    isMove,
    isCreating,
    startCreating: () => setIsCreating(true),
    stopCreating: () => setIsCreating(false),
    select,
    remove,
    createAndSave,
  };
}
