import type { ReactNode } from 'react';
import { Modal } from '@/components';
import { REVIEW_COPY } from '@/constants';
import { DECISION_MODE } from '../constants';
import type { DecisionMode } from '../constants';
import { DecisionNoteForm } from './DecisionNoteForm';

interface DecisionNoteModalProps {
  mode: DecisionMode | null;
  isPending: boolean;
  isDisabled?: boolean;
  // Shown above the form, e.g. a lock banner that must stay reachable while the note is open.
  notice?: ReactNode;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export function DecisionNoteModal({
  mode,
  isPending,
  isDisabled = false,
  notice,
  onClose,
  onSubmit,
}: DecisionNoteModalProps) {
  const title =
    mode === DECISION_MODE.REJECT ? REVIEW_COPY.REJECT_TITLE : REVIEW_COPY.CHANGES_TITLE;

  return (
    <Modal isOpen={mode !== null} onClose={onClose} title={title}>
      {/* Mounted only while open so every dialog starts with an empty note. */}
      {notice}
      {mode !== null && (
        <DecisionNoteForm
          mode={mode}
          isPending={isPending}
          isDisabled={isDisabled}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
