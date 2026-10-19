import { NavLink } from 'react-router-dom';
import { REVIEW_COPY, ROUTES } from '@/constants';
import { useReviewNav } from '../hooks/useReviewNav';
import './ReviewNav.css';

export function ReviewNav() {
  const { canSubmit, canReview, returnedCount, waitingCount } = useReviewNav();

  return (
    <nav className="rnav" aria-label={REVIEW_COPY.NAV_LABEL}>
      <NavLink end to={ROUTES.HOME} className="rnav__link">
        {REVIEW_COPY.NAV_QUESTIONS}
      </NavLink>
      {canSubmit && (
        <NavLink to={ROUTES.MY_QUESTIONS} className="rnav__link">
          {REVIEW_COPY.NAV_MY_SUBMISSIONS}
          {returnedCount > 0 && (
            <span className="rnav__count" aria-label={REVIEW_COPY.NAV_COUNT(returnedCount)}>
              {returnedCount}
            </span>
          )}
        </NavLink>
      )}
      {canReview && (
        <NavLink to={ROUTES.REVIEW_QUEUE} className="rnav__link">
          {REVIEW_COPY.NAV_REVIEW_QUEUE}
          {waitingCount > 0 && (
            <span className="rnav__count" aria-label={REVIEW_COPY.NAV_COUNT(waitingCount)}>
              {waitingCount}
            </span>
          )}
        </NavLink>
      )}
    </nav>
  );
}
