import { Button, TextField } from '@/components';
import { ADMIN_COPY } from '@/constants';
import { useAddClientForm } from '../hooks/useAddClientForm';
import './AddClientForm.css';

interface AddClientFormProps {
  onDone: () => void;
}

export function AddClientForm({ onDone }: AddClientFormProps) {
  const { values, errors, handleChange, handleSubmit, isPending } = useAddClientForm(onDone);

  return (
    <form className="client-form" onSubmit={handleSubmit} noValidate>
      <TextField
        className="client-form__name"
        label={ADMIN_COPY.FIELD_CLIENT_NAME}
        name="name"
        autoComplete="off"
        autoFocus
        placeholder={ADMIN_COPY.PLACEHOLDER_CLIENT_NAME}
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Button type="submit" isLoading={isPending}>
        {isPending ? ADMIN_COPY.ADDING_CLIENT : ADMIN_COPY.CONFIRM_ADD}
      </Button>
      <Button variant="secondary" onClick={onDone} disabled={isPending}>
        {ADMIN_COPY.CANCEL}
      </Button>
    </form>
  );
}
