import { useState } from 'react';
import type { Question } from '@/api';
import { SAVED_COPY } from '@/constants';
import { useSavedState } from './useSavedState';

export type SaveButtonMode = 'save' | 'move';

export function useSaveQuestionButton(question: Question, mode: SaveButtonMode) {
  const { collections, entries } = useSavedState();
  const [isOpen, setIsOpen] = useState(false);

  const currentCollectionId = entries.find(
    (entry) => entry.question.id === question.id,
  )?.collectionId;
  const collectionName = collections.find(
    (collection) => collection.id === currentCollectionId,
  )?.name;
  const isMove = mode === 'move';

  const label = isMove
    ? SAVED_COPY.MOVE
    : collectionName
      ? SAVED_COPY.SAVED_IN(collectionName)
      : SAVED_COPY.SAVE;
  const ariaLabel = isMove
    ? SAVED_COPY.MOVE_ARIA(question.text)
    : collectionName
      ? SAVED_COPY.SAVED_ARIA(collectionName, question.text)
      : SAVED_COPY.SAVE_ARIA(question.text);

  return {
    isOpen,
    toggle: () => setIsOpen((current) => !current),
    close: () => setIsOpen(false),
    currentCollectionId,
    isSaved: currentCollectionId !== undefined,
    isMove,
    label,
    ariaLabel,
    pickerTitle: isMove ? SAVED_COPY.PICKER_MOVE_TITLE : SAVED_COPY.PICKER_SAVE_TITLE,
  };
}
