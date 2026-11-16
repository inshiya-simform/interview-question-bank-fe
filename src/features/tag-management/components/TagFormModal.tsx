import type { ManagedCategory, ManagedTag } from '@/api';
import { Alert, Button, Modal, TextField } from '@/components';
import { NAME_MAX_LENGTH, TAG_COPY } from '@/constants';
import { useTagFormModal } from '../hooks/useTagFormModal';

interface TagFormModalProps {
  tag: ManagedTag;
  category: ManagedCategory;
  onClose: () => void;
}

export function TagFormModal({ tag, category, onClose }: TagFormModalProps) {
  const { values, nameError, formError, handleChange, handleSubmit, isPending } = useTagFormModal(
    tag,
    category,
    onClose,
  );

  return (
    <Modal isOpen onClose={onClose} title={TAG_COPY.EDIT_TAG_TITLE}>
      <form className="tag-dialog" onSubmit={handleSubmit} noValidate>
        <TextField
          label={TAG_COPY.FIELD_TAG_NAME}
          name="name"
          autoComplete="off"
          autoFocus
          maxLength={NAME_MAX_LENGTH}
          value={values.name}
          onChange={handleChange}
          error={nameError}
          hint={TAG_COPY.TAG_RENAME_HINT(tag.questionCount)}
        />
        {formError && <Alert>{formError}</Alert>}
        <div className="tag-dialog__actions">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            {TAG_COPY.CANCEL}
          </Button>
          <Button type="submit" isLoading={isPending}>
            {TAG_COPY.SAVE_CHANGES}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
