import { toast } from 'react-toastify';
import { MESSAGES } from '@/constants';
import { unsaveQuestion } from '../mock/store';

export function useUnsaveButton(questionId: string) {
  return {
    unsave: () => {
      unsaveQuestion(questionId);
      toast.success(MESSAGES.QUESTION_UNSAVED);
    },
  };
}
