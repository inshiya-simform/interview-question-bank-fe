import { Button } from '@/components';
import { REVIEW_COPY } from '@/constants';

interface ReviewDecisionBarProps {
  onApprove: () => void;
  onRequestChanges: () => void;
  onReject: () => void;
  isPending: boolean;
  isDisabled: boolean;
}

export function ReviewDecisionBar({
  onApprove,
  onRequestChanges,
  onReject,
  isPending,
  isDisabled,
}: ReviewDecisionBarProps) {
  return (
    <div role="group" aria-label={REVIEW_COPY.DECISIONS_LABEL} className="rdecision">
      <Button variant="secondary" onClick={onReject} disabled={isPending || isDisabled}>
        {REVIEW_COPY.REJECT}
      </Button>
      <Button variant="secondary" onClick={onRequestChanges} disabled={isPending || isDisabled}>
        {REVIEW_COPY.REQUEST_CHANGES}
      </Button>
      <Button onClick={onApprove} isLoading={isPending} disabled={isDisabled}>
        {REVIEW_COPY.APPROVE}
      </Button>
    </div>
  );
}
