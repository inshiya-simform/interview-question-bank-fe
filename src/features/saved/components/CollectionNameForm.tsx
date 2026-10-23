import { Button, TextField } from '@/components';
import { SAVED_COPY } from '@/constants';
import { useCollectionNameForm } from '../hooks/useCollectionNameForm';
import './CollectionNameForm.css';

interface CollectionNameFormProps {
  submitLabel: string;
  onSubmit: (name: string) => string | undefined;
  onCancel?: () => void;
  cancelLabel?: string;
  initialName?: string;
}

export function CollectionNameForm({
  submitLabel,
  onSubmit,
  onCancel,
  cancelLabel = SAVED_COPY.CANCEL,
  initialName = '',
}: CollectionNameFormProps) {
  const { name, error, handleChange, handleSubmit } = useCollectionNameForm({
    initialName,
    onSubmit,
  });

  return (
    <form className="name-form" onSubmit={handleSubmit} noValidate>
      <TextField
        label={SAVED_COPY.FIELD_NAME}
        name="name"
        value={name}
        onChange={handleChange}
        placeholder={SAVED_COPY.PLACEHOLDER_NAME}
        autoComplete="off"
        autoFocus
        error={error}
      />
      <div className="name-form__actions">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
