import { Alert, Button, PasswordField, TextField } from '@/components';
import { AUTH_COPY } from '@/constants';
import type { RegisterPayload } from '@/api';
import { useRegisterForm } from '../hooks/useRegisterForm';
import './AuthForm.css';

interface RegisterFormProps {
  onSubmit?: (payload: RegisterPayload) => void;
  isPending?: boolean;
  errorMessage?: string;
}

export function RegisterForm({ onSubmit, isPending, errorMessage }: RegisterFormProps) {
  const { values, errors, handleChange, handleSubmit } = useRegisterForm(onSubmit);

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {errorMessage && <Alert>{errorMessage}</Alert>}
      <TextField
        label={AUTH_COPY.FIELD_NAME}
        name="name"
        autoComplete="name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <TextField
        label={AUTH_COPY.FIELD_EMAIL}
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <PasswordField
        label={AUTH_COPY.FIELD_PASSWORD}
        name="password"
        autoComplete="new-password"
        hint={AUTH_COPY.PASSWORD_HINT}
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Button type="submit" fullWidth isLoading={isPending}>
        {AUTH_COPY.REGISTER_SUBMIT}
      </Button>
    </form>
  );
}
