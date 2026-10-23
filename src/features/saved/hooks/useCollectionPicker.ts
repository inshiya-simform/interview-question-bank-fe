import { useId, useState } from 'react';
import { toast } from 'react-toastify';
import type { Question } from '@/api';
import { MESSAGES } from '@/constants';
import { createCollection, saveQuestion, unsaveQuestion } from '../mock/store';
import type { Collection } from '../types';
import { useSavedState } from './useSavedState';

interface UseCollectionPickerArgs {
  question: Question;
  currentCollectionId?: string;
  onDone: () => void;
}

export function useCollectionPicker({
  question,
  currentCollectionId,
  onDone,
}: UseCollectionPickerArgs) {
  const { collections } = useSavedState();
  const [isCreating, setIsCreating] = useState(false);
  const groupName = useId();
  const isMove = currentCollectionId !== undefined;

  const saveInto = (collection: Pick<Collection, 'id' | 'name'>) => {
    saveQuestion(question, collection.id);
    toast.success(
      isMove ? MESSAGES.QUESTION_MOVED(collection.name) : MESSAGES.QUESTION_SAVED(collection.name),
    );
    onDone();
  };

  const select = (collection: Collection) => {
    if (collection.id !== currentCollectionId) saveInto(collection);
  };

  const remove = () => {
    unsaveQuestion(question.id);
    toast.success(MESSAGES.QUESTION_UNSAVED);
    onDone();
  };

  const createAndSave = (name: string) => {
    const result = createCollection(name);
    if (!result.ok) return result.error;
    saveInto(result.collection);
    return undefined;
  };

  return {
    collections,
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
