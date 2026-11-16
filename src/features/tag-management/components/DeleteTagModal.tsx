import type { ManagedTag } from '@/api';
import { Button, Icon, Modal } from '@/components';
import { TAG_COPY } from '@/constants';
import { useDeleteTagModal } from '../hooks/useDeleteTagModal';

interface DeleteTagModalProps {
  tag: ManagedTag;
  onClose: () => void;
  onBlocked: (name: string) => void;
}

export function DeleteTagModal({ tag, onClose, onBlocked }: DeleteTagModalProps) {
  const { confirm, isPending } = useDeleteTagModal({ tag, onClose, onBlocked });

  return (
    <Modal isOpen onClose={onClose} title={TAG_COPY.DELETE_TAG_TITLE(tag.name)}>
      <div className="tag-dialog">
        <p className="tag-dialog__body">{TAG_COPY.DELETE_TAG_BODY}</p>
        <div className="tag-dialog__actions">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            {TAG_COPY.CANCEL}
          </Button>
          <Button variant="danger" isLoading={isPending} onClick={confirm}>
            <Icon name="trash" size={16} />
            {TAG_COPY.DELETE_TAG_CONFIRM}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
