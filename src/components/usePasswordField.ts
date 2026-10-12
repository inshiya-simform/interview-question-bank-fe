import { useDisclosure } from '@/hooks/useDisclosure';

export function usePasswordField() {
  const { isOpen, toggle } = useDisclosure();
  return { isVisible: isOpen, toggle };
}
