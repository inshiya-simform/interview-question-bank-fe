import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { usePopover } from './usePopover';
import type { PopoverPlacement } from './usePopover';
import './Popover.css';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  placement?: PopoverPlacement;
  // Lets a caller restyle the wrapper (e.g. full width) and the panel (size, padding).
  className?: string;
  panelClassName?: string;
  // Rendered first so it stays the wrapper's first button, which receives focus on Escape.
  trigger: ReactNode;
  children: ReactNode;
}

export function Popover({
  isOpen,
  onClose,
  label,
  placement,
  className,
  panelClassName,
  trigger,
  children,
}: PopoverProps) {
  const { wrapperRef, panelRef, position } = usePopover(isOpen, onClose, placement);

  return (
    <div ref={wrapperRef} className={cn('popover', className)}>
      {trigger}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={label}
          tabIndex={-1}
          className={cn('popover__panel', panelClassName)}
          style={position}
        >
          {children}
        </div>
      )}
    </div>
  );
}
