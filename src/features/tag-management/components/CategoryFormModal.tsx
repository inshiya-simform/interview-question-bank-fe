import type { ManagedCategory } from '@/api';
import { Alert, Button, Modal, TextAreaField, TextField } from '@/components';
import { CATEGORY_DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, TAG_COPY } from '@/constants';
import { useCategoryFormModal } from '../hooks/useCategoryFormModal';

interface CategoryFormModalProps {
  category?: ManagedCategory;
  onClose: () => void;
}

export function CategoryFormModal({ category, onClose }: CategoryFormModalProps) {
  const { values, errors, nameError, formError, handleChange, handleSubmit, isPending } =
    useCategoryFormModal(category, onClose);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={category ? TAG_COPY.EDIT_CATEGORY_TITLE : TAG_COPY.CREATE_CATEGORY_TITLE}
    >
      <form className="tag-dialog" onSubmit={handleSubmit} noValidate>
        <TextField
          label={TAG_COPY.FIELD_CATEGORY_NAME}
          name="name"
          autoComplete="off"
          autoFocus
          maxLength={NAME_MAX_LENGTH}
          placeholder={TAG_COPY.PLACEHOLDER_CATEGORY_NAME}
          value={values.name}
          onChange={handleChange}
          error={nameError}
        />
        <TextAreaField
          label={TAG_COPY.FIELD_CATEGORY_DESCRIPTION}
          name="description"
          rows={3}
          maxLength={CATEGORY_DESCRIPTION_MAX_LENGTH}
          placeholder={TAG_COPY.PLACEHOLDER_CATEGORY_DESCRIPTION}
          value={values.description}
          onChange={handleChange}
          error={errors.description}
        />
        {!category && <p className="tag-dialog__hint">{TAG_COPY.CREATE_CATEGORY_HINT}</p>}
        {formError && <Alert>{formError}</Alert>}
        <div className="tag-dialog__actions">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            {TAG_COPY.CANCEL}
          </Button>
          <Button type="submit" isLoading={isPending}>
            {category ? TAG_COPY.SAVE_CHANGES : TAG_COPY.CREATE_CATEGORY_SUBMIT}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
