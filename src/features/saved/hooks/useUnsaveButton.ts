import { toast } from 'react-toastify';
import { useUnsaveQuestionMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';

export function useUnsaveButton(questionId: string) {
  const { mutate, isPending } = useUnsaveQuestionMutation();

  return {
    isPending,
    unsave: () => mutate(questionId, { onSuccess: () => toast.success(MESSAGES.QUESTION_UNSAVED) }),
  };
}
