import { Alert, Button, PasswordField, TextField } from '@/components';
import { Link } from 'react-router-dom';
import { AUTH_COPY, PASSWORD_RESET_COPY, ROUTES } from '@/constants';
import type { LoginPayload } from '@/api';
import { useLoginForm } from '../hooks/useLoginForm';
import './AuthForm.css';

interface LoginFormProps {
  onSubmit?: (payload: LoginPayload) => void;
  isPending?: boolean;
  errorMessage?: string;
}

export function LoginForm({ onSubmit, isPending, errorMessage }: LoginFormProps) {
  const { values, errors, handleChange, handleSubmit } = useLoginForm(onSubmit);

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
      <PasswordField
        label={AUTH_COPY.FIELD_PASSWORD}
        name="password"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />
      <p className="auth-form__aside">
        <Link to={ROUTES.FORGOT_PASSWORD}>{PASSWORD_RESET_COPY.LOGIN_FORGOT_LINK}</Link>
      </p>
      <Button type="submit" fullWidth isLoading={isPending}>
        {AUTH_COPY.LOGIN_SUBMIT}
      </Button>
    </form>
  );
}
