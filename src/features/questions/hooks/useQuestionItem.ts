import { useId } from 'react';
import type { Question } from '@/api';
import { useSession } from '@/features/auth';
import { useDisclosure } from '@/hooks/useDisclosure';
import { canEditQuestion } from '@/utils/permissions';

export function useQuestionItem(question: Question) {
  const { isOpen, toggle } = useDisclosure();
  const { user } = useSession();
  const id = useId();
  return {
    isOpen,
    toggle,
    triggerId: id,
    panelId: `${id}-panel`,
    canEdit: canEditQuestion(user, question),
  };
}
