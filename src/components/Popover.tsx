import type { ReactNode } from 'react';
import { usePopover } from './usePopover';
import './Popover.css';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  // Rendered first so it stays the wrapper's first button, which receives focus on Escape.
  trigger: ReactNode;
  children: ReactNode;
}

export function Popover({ isOpen, onClose, label, trigger, children }: PopoverProps) {
  const { wrapperRef, panelRef, position } = usePopover(isOpen, onClose);

  return (
    <div ref={wrapperRef} className="popover">
      {trigger}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={label}
          tabIndex={-1}
          className="popover__panel"
          style={position}
        >
          {children}
        </div>
      )}
    </div>
  );
}
