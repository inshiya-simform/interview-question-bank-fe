import { useId } from 'react';
import { useDisclosure } from '@/hooks/useDisclosure';

export function useQuestionItem() {
  const { isOpen, toggle } = useDisclosure();
  const id = useId();
  return { isOpen, toggle, triggerId: id, panelId: `${id}-panel` };
}
