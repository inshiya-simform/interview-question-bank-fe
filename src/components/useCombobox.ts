import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { SelectOption } from './selectOption';

interface UseComboboxArgs {
  options: readonly SelectOption[];
  value: string;
  onChange: (next: string) => void;
  onQueryChange?: (query: string) => void;
}

const matches = (option: SelectOption, term: string) =>
  `${option.label} ${option.description ?? ''}`.toLowerCase().includes(term);

export function useCombobox({ options, value, onChange, onQueryChange }: UseComboboxArgs) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [anchor, setAnchor] = useState<DOMRect>();
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;

  // With a selection the input shows its label, so the full list stays available.
  const term = value ? '' : inputValue.trim().toLowerCase();
  const filtered = term ? options.filter((option) => matches(option, term)) : options;
  const activeOption = filtered[activeIndex];

  const measure = () => setAnchor(inputRef.current?.getBoundingClientRect());

  // The panel is portalled to <body> with fixed positioning so scrolling ancestors can't clip it.
  useEffect(() => {
    if (!isOpen) return;
    const reposition = () => setAnchor(inputRef.current?.getBoundingClientRect());
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [isOpen]);

  const openPanel = () => {
    measure();
    setIsOpen(true);
  };

  const select = (option: SelectOption) => {
    setInputValue(option.label);
    setIsOpen(false);
    onChange(option.value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onQueryChange?.(event.target.value);
    setActiveIndex(0);
    openPanel();
    if (value) onChange('');
  };

  const move = (step: number) => {
    openPanel();
    setActiveIndex((current) => Math.min(Math.max(current + step, 0), filtered.length - 1));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Enter':
        if (!isOpen || !activeOption) return;
        event.preventDefault();
        select(activeOption);
        break;
      case 'Escape':
        if (!isOpen) return;
        event.stopPropagation();
        setIsOpen(false);
        break;
    }
  };

  return {
    inputValue,
    isOpen,
    activeIndex,
    listboxId,
    optionId: (index: number) => `${baseId}-option-${index}`,
    filtered,
    activeDescendant: isOpen && activeOption ? `${baseId}-option-${activeIndex}` : undefined,
    select,
    inputRef,
    panelStyle: anchor && { top: anchor.bottom, left: anchor.left, width: anchor.width },
    open: openPanel,
    close: () => setIsOpen(false),
    handleInputChange,
    handleKeyDown,
  };
}
