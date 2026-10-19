import type { ReactNode } from 'react';
import { useId } from 'react';
import { useModal } from './useModal';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const { dialogRef, handleBackdropClick } = useModal(isOpen, onClose);
  const titleId = useId();

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <h2 id={titleId} className="modal__title">
        {title}
      </h2>
      {children}
    </dialog>
  );
}
