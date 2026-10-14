import { useEffect, useId, useRef, useState } from 'react';

interface UseMultiSelectArgs {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

export function useMultiSelect({ value, onChange, disabled }: UseMultiSelectArgs) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const panelId = `${triggerId}-panel`;
  const expanded = isOpen && !disabled;

  useEffect(() => {
    if (!expanded) return;
    const closeOnOutside = (event: MouseEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutside);
    return () => document.removeEventListener('mousedown', closeOnOutside);
  }, [expanded]);

  const toggleOpen = () => setIsOpen((current) => !current);

  const toggleOption = (option: string) =>
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Escape' || !expanded) return;
    event.stopPropagation();
    setIsOpen(false);
  };

  return { rootRef, triggerId, panelId, expanded, toggleOpen, toggleOption, handleKeyDown };
}
