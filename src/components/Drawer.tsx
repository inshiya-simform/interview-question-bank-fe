import type { ReactNode } from 'react';
import { useId } from 'react';
import { useDrawer } from './useDrawer';
import './Drawer.css';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
}

export function Drawer({ isOpen, onClose, title, closeLabel, children }: DrawerProps) {
  const { dialogRef, handleBackdropClick } = useDrawer(isOpen, onClose);
  const titleId = useId();

  return (
    <dialog
      ref={dialogRef}
      className="drawer"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <header className="drawer__header">
        <h2 id={titleId}>{title}</h2>
        <button type="button" className="drawer__close" aria-label={closeLabel} onClick={onClose}>
          ✕
        </button>
      </header>
      <div className="drawer__body">{children}</div>
    </dialog>
  );
}
