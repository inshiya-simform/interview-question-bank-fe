import { Link } from 'react-router-dom';
import { AuthLayout, RegisterForm } from '@/features/auth';
import { AUTH_COPY, ROUTES } from '@/constants';
import { useRegisterPage } from './useRegisterPage';

export function RegisterPage() {
  const { handleSubmit, isPending } = useRegisterPage();

  return (
    <AuthLayout
      title={AUTH_COPY.REGISTER_TITLE}
      subtitle={AUTH_COPY.REGISTER_SUBTITLE}
      footer={
        <>
          {AUTH_COPY.REGISTER_SWITCH_PROMPT}{' '}
          <Link to={ROUTES.LOGIN}>{AUTH_COPY.REGISTER_SWITCH_LINK}</Link>
        </>
      }
    >
      <RegisterForm onSubmit={handleSubmit} isPending={isPending} />
    </AuthLayout>
  );
}
