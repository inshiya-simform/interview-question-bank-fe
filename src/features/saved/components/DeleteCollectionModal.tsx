import { Button, Modal } from '@/components';
import { SAVED_COPY } from '@/constants';
import { useDeleteCollectionModal } from '../hooks/useDeleteCollectionModal';
import type { Collection } from '../types';
import './DeleteCollectionModal.css';

interface DeleteCollectionModalProps {
  collection: Collection;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteCollectionModal({
  collection,
  isOpen,
  onClose,
  onDeleted,
}: DeleteCollectionModalProps) {
  const { confirm } = useDeleteCollectionModal({ collection, onClose, onDeleted });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={SAVED_COPY.DELETE_TITLE(collection.name)}>
      <div className="delete-collection">
        <p className="delete-collection__body">
          {SAVED_COPY.DELETE_BODY(collection.questionCount)}
        </p>
        <p className="delete-collection__warning">
          <strong>{SAVED_COPY.WARNING_LEAD}</strong> {SAVED_COPY.DELETE_WARNING}
        </p>
        <div className="delete-collection__actions">
          <Button variant="secondary" onClick={onClose}>
            {SAVED_COPY.CANCEL}
          </Button>
          <Button variant="danger" onClick={confirm}>
            {SAVED_COPY.DELETE_CONFIRM}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
