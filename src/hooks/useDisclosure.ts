import { useState } from 'react';

export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const toggle = () => setIsOpen((current) => !current);
  return { isOpen, toggle };
}
