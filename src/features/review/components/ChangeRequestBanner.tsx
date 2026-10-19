import type { ReviewDecision } from '@/api';
import { REVIEW_COPY, REVIEW_STATUS } from '@/constants';
import type { ReviewStatus } from '@/constants';
import { formatDateTime } from '@/utils/date';
import { cn } from '@/utils/cn';
import './ChangeRequestBanner.css';

interface ChangeRequestBannerProps {
  status: ReviewStatus;
  decision: ReviewDecision;
}

export function ChangeRequestBanner({ status, decision }: ChangeRequestBannerProps) {
  const isRejection = status === REVIEW_STATUS.REJECTED;

  return (
    <section className={cn('crbanner', isRejection && 'crbanner--soft')}>
      <h4 className="crbanner__title">
        {isRejection ? REVIEW_COPY.BANNER_REJECTED : `! ${REVIEW_COPY.BANNER_CHANGES}`}
      </h4>
      <p className="crbanner__meta">
        {REVIEW_COPY.BANNER_META(decision.decidedBy.name, formatDateTime(decision.decidedAt))}
      </p>
      <p className="crbanner__note">{decision.note || REVIEW_COPY.NO_REASON}</p>
    </section>
  );
}
