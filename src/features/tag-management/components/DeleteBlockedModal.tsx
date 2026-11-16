import { Button, Modal } from '@/components';
import { TAG_COPY } from '@/constants';

interface DeleteBlockedModalProps {
  name: string;
  onClose: () => void;
}

export function DeleteBlockedModal({ name, onClose }: DeleteBlockedModalProps) {
  return (
    <Modal isOpen onClose={onClose} title={TAG_COPY.BLOCKED_TITLE(name)}>
      <div className="tag-dialog">
        <p className="tag-dialog__notice">
          <span aria-hidden="true">{TAG_COPY.LOCKED_GLYPH} </span>
          {TAG_COPY.BLOCKED_BODY}
        </p>
        <div className="tag-dialog__actions">
          <Button onClick={onClose}>{TAG_COPY.BLOCKED_DISMISS}</Button>
        </div>
      </div>
    </Modal>
  );
}
