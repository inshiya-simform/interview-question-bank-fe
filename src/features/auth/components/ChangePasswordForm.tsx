import { Alert, Button, PasswordField } from '@/components';
import { AUTH_COPY, CHANGE_PASSWORD_COPY, PASSWORD_RESET_COPY } from '@/constants';
import type { ChangePasswordPayload } from '@/api';
import { useChangePasswordForm } from '../hooks/useChangePasswordForm';
import './AuthForm.css';

interface ChangePasswordFormProps {
  onSubmit?: (values: ChangePasswordPayload, reset: () => void) => void;
  isPending?: boolean;
  errorMessage?: string;
  fieldErrors?: Partial<Record<keyof ChangePasswordPayload, string>>;
}

export function ChangePasswordForm({
  onSubmit,
  isPending,
  errorMessage,
  fieldErrors,
}: ChangePasswordFormProps) {
  const { values, errors, handleChange, handleSubmit } = useChangePasswordForm(
    onSubmit,
    fieldErrors,
  );

  return (
    <form className="auth-form auth-form--card" onSubmit={handleSubmit} noValidate>
      {errorMessage && <Alert>{errorMessage}</Alert>}
      <PasswordField
        label={CHANGE_PASSWORD_COPY.FIELD_CURRENT_PASSWORD}
        name="currentPassword"
        autoComplete="current-password"
        value={values.currentPassword}
        onChange={handleChange}
        error={errors.currentPassword}
      />
      <PasswordField
        label={PASSWORD_RESET_COPY.FIELD_NEW_PASSWORD}
        name="password"
        autoComplete="new-password"
        hint={PASSWORD_RESET_COPY.PASSWORD_HINT}
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />
      <PasswordField
        label={AUTH_COPY.FIELD_CONFIRM_PASSWORD}
        name="confirmPassword"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      <Button type="submit" isLoading={isPending}>
        {CHANGE_PASSWORD_COPY.SUBMIT}
      </Button>
    </form>
  );
}
