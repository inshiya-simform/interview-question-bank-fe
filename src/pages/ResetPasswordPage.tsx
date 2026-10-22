import { Link } from 'react-router-dom';
import { Loader } from '@/components';
import { AuthLayout, ResetLinkNotice, ResetPasswordForm } from '@/features/auth';
import { MESSAGES, PASSWORD_RESET_COPY, ROUTES } from '@/constants';
import { useResetPasswordPage } from './useResetPasswordPage';
import type { ResetPasswordView } from './useResetPasswordPage';

const TITLES: Record<ResetPasswordView, string> = {
  form: PASSWORD_RESET_COPY.RESET_TITLE,
  loading: PASSWORD_RESET_COPY.RESET_TITLE,
  invalid: PASSWORD_RESET_COPY.INVALID_LINK_TITLE,
  'rate-limited': PASSWORD_RESET_COPY.UNAVAILABLE_TITLE,
  error: PASSWORD_RESET_COPY.UNAVAILABLE_TITLE,
};

export function ResetPasswordPage() {
  const { view, handleSubmit, isPending, fieldErrors, errorMessage, verifyErrorMessage } =
    useResetPasswordPage();

  return (
    <AuthLayout
      title={TITLES[view]}
      subtitle={view === 'form' ? PASSWORD_RESET_COPY.RESET_SUBTITLE : ''}
      footer={<Link to={ROUTES.LOGIN}>{PASSWORD_RESET_COPY.BACK_TO_LOGIN}</Link>}
    >
      {view === 'loading' && <Loader label={PASSWORD_RESET_COPY.RESET_VERIFYING} />}
      {view === 'invalid' && (
        <ResetLinkNotice
          message={PASSWORD_RESET_COPY.INVALID_LINK_MESSAGE}
          actionTo={ROUTES.FORGOT_PASSWORD}
        />
      )}
      {view === 'rate-limited' && (
        <ResetLinkNotice
          message={MESSAGES.TOO_MANY_ATTEMPTS}
          actionTo={ROUTES.LOGIN}
          actionLabel={PASSWORD_RESET_COPY.BACK_TO_LOGIN}
        />
      )}
      {view === 'error' && (
        <ResetLinkNotice message={verifyErrorMessage} actionTo={ROUTES.FORGOT_PASSWORD} />
      )}
      {view === 'form' && (
        <ResetPasswordForm
          onSubmit={handleSubmit}
          isPending={isPending}
          errorMessage={errorMessage}
          fieldErrors={fieldErrors}
        />
      )}
    </AuthLayout>
  );
}
