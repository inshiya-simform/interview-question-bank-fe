import { Link } from 'react-router-dom';
import { AuthLayout, LoginForm } from '@/features/auth';
import { AUTH_COPY, ROUTES } from '@/constants';

export function LoginPage() {
  return (
    <AuthLayout
      title={AUTH_COPY.LOGIN_TITLE}
      subtitle={AUTH_COPY.LOGIN_SUBTITLE}
      footer={
        <>
          {AUTH_COPY.LOGIN_SWITCH_PROMPT}{' '}
          <Link to={ROUTES.REGISTER}>{AUTH_COPY.LOGIN_SWITCH_LINK}</Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
