import { Link } from 'react-router-dom';
import { Alert } from '@/components';
import { ForgotPasswordForm, AuthLayout } from '@/features/auth';
import { PASSWORD_RESET_COPY, ROUTES } from '@/constants';
import { useForgotPasswordPage } from './useForgotPasswordPage';

export function ForgotPasswordPage() {
  const { handleSubmit, isPending, sentMessage, errorMessage, emailError } =
    useForgotPasswordPage();
  const isSent = sentMessage !== undefined;

  return (
    <AuthLayout
      title={isSent ? PASSWORD_RESET_COPY.FORGOT_SENT_TITLE : PASSWORD_RESET_COPY.FORGOT_TITLE}
      subtitle={
        isSent ? PASSWORD_RESET_COPY.FORGOT_SENT_SUBTITLE : PASSWORD_RESET_COPY.FORGOT_SUBTITLE
      }
      footer={<Link to={ROUTES.LOGIN}>{PASSWORD_RESET_COPY.BACK_TO_LOGIN}</Link>}
    >
      {isSent ? (
        <Alert role="status">{sentMessage}</Alert>
      ) : (
        <ForgotPasswordForm
          onSubmit={handleSubmit}
          isPending={isPending}
          errorMessage={errorMessage}
          emailError={emailError}
        />
      )}
    </AuthLayout>
  );
}
