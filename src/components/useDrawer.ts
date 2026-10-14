import { useEffect, useRef } from 'react';

// Native <dialog> gives us the focus trap, inert background and Escape handling.
export function useDrawer(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return { dialogRef, handleBackdropClick };
}
