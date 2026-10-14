import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateQuestionMutation } from '@/api/hooks';
import type { Question } from '@/api';
import { MESSAGES } from '@/constants';
import type { AddQuestionValues } from '../schema';
import { buildCreateQuestionPayload } from '../utils';

// There is no list endpoint yet, so the list holds questions added during this session.
export function useQuestionsHome() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { mutate, isPending } = useCreateQuestionMutation();

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addQuestion = (values: AddQuestionValues, onSuccess: () => void) => {
    mutate(buildCreateQuestionPayload(values), {
      onSuccess: (created) => {
        setQuestions((current) => [created, ...current]);
        toast.success(MESSAGES.QUESTION_ADDED);
        onSuccess();
        closeDrawer();
      },
    });
  };

  return { questions, isDrawerOpen, isSubmitting: isPending, openDrawer, closeDrawer, addQuestion };
}
