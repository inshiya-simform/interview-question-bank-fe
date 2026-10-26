import { PageHeader } from '@/components';
import { CHANGE_PASSWORD_COPY } from '@/constants';
import { ChangePasswordForm } from '@/features/auth';
import { useChangePasswordPage } from './useChangePasswordPage';

export function ChangePasswordPage() {
  const { handleSubmit, isPending, errorMessage, fieldErrors } = useChangePasswordPage();

  return (
    <>
      <PageHeader title={CHANGE_PASSWORD_COPY.TITLE} subtitle={CHANGE_PASSWORD_COPY.SUBTITLE} />
      <ChangePasswordForm
        onSubmit={handleSubmit}
        isPending={isPending}
        errorMessage={errorMessage}
        fieldErrors={fieldErrors}
      />
    </>
  );
}
