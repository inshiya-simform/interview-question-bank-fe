import { Button, TextField } from '@/components';
import { ADMIN_COPY } from '@/constants';
import { useAddUserToClient } from '../hooks/useAddUserToClient';
import './AddUserToClient.css';

interface AddUserToClientProps {
  isPending: boolean;
  onAdd: (email: string) => void;
  onCancel: () => void;
}

export function AddUserToClient({ isPending, onAdd, onCancel }: AddUserToClientProps) {
  const { email, error, handleChange, handleSubmit } = useAddUserToClient(onAdd);

  return (
    <form className="add-user" onSubmit={handleSubmit} noValidate>
      <TextField
        className="add-user__email"
        label={ADMIN_COPY.FIELD_USER_EMAIL}
        name="email"
        type="email"
        autoComplete="off"
        autoFocus
        placeholder={ADMIN_COPY.PLACEHOLDER_USER_EMAIL}
        value={email}
        onChange={handleChange}
        error={error}
      />
      <Button type="submit" isLoading={isPending}>
        {ADMIN_COPY.CONFIRM_ADD}
      </Button>
      <Button variant="secondary" onClick={onCancel} disabled={isPending}>
        {ADMIN_COPY.CANCEL}
      </Button>
    </form>
  );
}
