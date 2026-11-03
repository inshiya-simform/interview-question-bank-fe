import { Button, Modal } from '@/components';
import { DISCUSSION_COPY } from '@/constants';

interface DeleteCommentModalProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCommentModal({
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: DeleteCommentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={DISCUSSION_COPY.DELETE_TITLE}>
      <p>{DISCUSSION_COPY.DELETE_BODY}</p>
      <div className="citem__modal-actions">
        <Button variant="secondary" onClick={onClose}>
          {DISCUSSION_COPY.CANCEL}
        </Button>
        <Button variant="danger" isLoading={isPending} onClick={onConfirm}>
          {DISCUSSION_COPY.DELETE_CONFIRM}
        </Button>
      </div>
    </Modal>
  );
}
