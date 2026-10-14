import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';
import type { QuestionFormValues } from '../schema';
import { buildQuestionPayload } from '../utils';

// The list refetches itself: saving a question invalidates the questions query prefix.
export function useQuestionsHome() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const create = useCreateQuestionMutation();
  const update = useUpdateQuestionMutation();

  const openDrawer = () => {
    setEditingId(null);
    setIsDrawerOpen(true);
  };
  const openEditDrawer = (id: string) => {
    setEditingId(id);
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => setIsDrawerOpen(false);

  const saveQuestion = (values: QuestionFormValues, onSuccess: () => void) => {
    const payload = buildQuestionPayload(values);
    const options = {
      onSuccess: () => {
        toast.success(editingId ? MESSAGES.QUESTION_UPDATED : MESSAGES.QUESTION_ADDED);
        onSuccess();
        closeDrawer();
      },
    };
    if (editingId) update.mutate({ id: editingId, payload }, options);
    else create.mutate(payload, options);
  };

  return {
    isDrawerOpen,
    editingId,
    isSubmitting: create.isPending || update.isPending,
    openDrawer,
    openEditDrawer,
    closeDrawer,
    saveQuestion,
  };
}
