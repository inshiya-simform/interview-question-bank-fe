import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateQuestionMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';
import type { AddQuestionValues } from '../schema';
import { buildCreateQuestionPayload } from '../utils';

// The list refetches itself: creating a question invalidates the questions query prefix.
export function useQuestionsHome() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { mutate, isPending } = useCreateQuestionMutation();

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addQuestion = (values: AddQuestionValues, onSuccess: () => void) => {
    mutate(buildCreateQuestionPayload(values), {
      onSuccess: () => {
        toast.success(MESSAGES.QUESTION_ADDED);
        onSuccess();
        closeDrawer();
      },
    });
  };

  return { isDrawerOpen, isSubmitting: isPending, openDrawer, closeDrawer, addQuestion };
}
