import { Alert, Button, PasswordField } from '@/components';
import { AUTH_COPY, PASSWORD_RESET_COPY } from '@/constants';
import type { ResetPasswordFormValues } from '@/api';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';
import './AuthForm.css';

interface ResetPasswordFormProps {
  onSubmit?: (values: ResetPasswordFormValues) => void;
  isPending?: boolean;
  errorMessage?: string;
  fieldErrors?: Partial<Record<keyof ResetPasswordFormValues, string>>;
}

export function ResetPasswordForm({
  onSubmit,
  isPending,
  errorMessage,
  fieldErrors,
}: ResetPasswordFormProps) {
  const { values, errors, handleChange, handleSubmit } = useResetPasswordForm(
    onSubmit,
    fieldErrors,
  );

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {errorMessage && <Alert>{errorMessage}</Alert>}
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
      <Button type="submit" fullWidth isLoading={isPending}>
        {PASSWORD_RESET_COPY.RESET_SUBMIT}
      </Button>
    </form>
  );
}
