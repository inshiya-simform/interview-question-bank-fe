import { Alert, Button, TextField } from '@/components';
import { AUTH_COPY, PASSWORD_RESET_COPY } from '@/constants';
import type { ForgotPasswordPayload } from '@/api';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';
import './AuthForm.css';

interface ForgotPasswordFormProps {
  onSubmit?: (payload: ForgotPasswordPayload) => void;
  isPending?: boolean;
  errorMessage?: string;
  emailError?: string;
}

export function ForgotPasswordForm({
  onSubmit,
  isPending,
  errorMessage,
  emailError,
}: ForgotPasswordFormProps) {
  const { values, errors, handleChange, handleSubmit } = useForgotPasswordForm(
    onSubmit,
    emailError,
  );

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {errorMessage && <Alert>{errorMessage}</Alert>}
      <TextField
        label={AUTH_COPY.FIELD_EMAIL}
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Button type="submit" fullWidth isLoading={isPending}>
        {PASSWORD_RESET_COPY.FORGOT_SUBMIT}
      </Button>
    </form>
  );
}
