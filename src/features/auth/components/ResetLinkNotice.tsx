import { Link } from 'react-router-dom';
import { Alert } from '@/components';
import { PASSWORD_RESET_COPY } from '@/constants';
import './AuthForm.css';

interface ResetLinkNoticeProps {
  message: string;
  actionTo: string;
  actionLabel?: string;
}

export function ResetLinkNotice({
  message,
  actionTo,
  actionLabel = PASSWORD_RESET_COPY.REQUEST_NEW_LINK,
}: ResetLinkNoticeProps) {
  return (
    <div className="auth-form">
      <Alert>{message}</Alert>
      <Link className="btn btn--primary btn--full auth-form__action" to={actionTo}>
        {actionLabel}
      </Link>
    </div>
  );
}
