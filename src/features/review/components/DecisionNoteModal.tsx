import { Modal } from '@/components';
import { REVIEW_COPY } from '@/constants';
import { DECISION_MODE } from '../constants';
import type { DecisionMode } from '../constants';
import { DecisionNoteForm } from './DecisionNoteForm';

interface DecisionNoteModalProps {
  mode: DecisionMode | null;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export function DecisionNoteModal({ mode, onClose, onSubmit }: DecisionNoteModalProps) {
  const title =
    mode === DECISION_MODE.REJECT ? REVIEW_COPY.REJECT_TITLE : REVIEW_COPY.CHANGES_TITLE;

  return (
    <Modal isOpen={mode !== null} onClose={onClose} title={title}>
      {/* Mounted only while open so every dialog starts with an empty note. */}
      {mode !== null && <DecisionNoteForm mode={mode} onSubmit={onSubmit} onCancel={onClose} />}
    </Modal>
  );
}
