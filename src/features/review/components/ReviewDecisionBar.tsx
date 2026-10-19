import { Button } from '@/components';
import { REVIEW_COPY } from '@/constants';

interface ReviewDecisionBarProps {
  onApprove: () => void;
  onRequestChanges: () => void;
  onReject: () => void;
}

export function ReviewDecisionBar({
  onApprove,
  onRequestChanges,
  onReject,
}: ReviewDecisionBarProps) {
  return (
    <div role="group" aria-label={REVIEW_COPY.DECISIONS_LABEL} className="rdecision">
      <Button variant="secondary" onClick={onReject}>
        {REVIEW_COPY.REJECT}
      </Button>
      <Button variant="secondary" onClick={onRequestChanges}>
        {REVIEW_COPY.REQUEST_CHANGES}
      </Button>
      <Button onClick={onApprove}>{REVIEW_COPY.APPROVE}</Button>
    </div>
  );
}
