import type { ManagedCategory } from '@/api';
import { Button, Icon, Modal } from '@/components';
import { TAG_COPY } from '@/constants';
import { useDeleteCategoryModal } from '../hooks/useDeleteCategoryModal';

interface DeleteCategoryModalProps {
  category: ManagedCategory;
  onClose: () => void;
  onBlocked: (name: string) => void;
}

export function DeleteCategoryModal({ category, onClose, onBlocked }: DeleteCategoryModalProps) {
  const { confirm, isPending } = useDeleteCategoryModal({ category, onClose, onBlocked });

  return (
    <Modal isOpen onClose={onClose} title={TAG_COPY.DELETE_CATEGORY_TITLE(category.name)}>
      <div className="tag-dialog">
        <p className="tag-dialog__body">{TAG_COPY.DELETE_CATEGORY_BODY(category.tagCount)}</p>
        <p className="tag-dialog__hint">{TAG_COPY.DELETE_CATEGORY_WARNING}</p>
        <div className="tag-dialog__actions">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            {TAG_COPY.CANCEL}
          </Button>
          <Button variant="danger" isLoading={isPending} onClick={confirm}>
            <Icon name="trash" size={16} />
            {TAG_COPY.DELETE_CATEGORY_CONFIRM}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
