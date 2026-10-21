import { Alert, Button } from '@/components';
import { REVIEW_COPY } from '@/constants';
import type { BulkFailure } from '../hooks/useBulkDecision';
import './BulkFailureList.css';

interface BulkFailureListProps {
  failures: readonly BulkFailure[];
  onDismiss: () => void;
}

export function BulkFailureList({ failures, onDismiss }: BulkFailureListProps) {
  return (
    <Alert>
      <div className="rfail__head">
        <strong>
          <span aria-hidden="true">! </span>
          {REVIEW_COPY.BULK_FAILED_LIST_TITLE}
        </strong>
        <Button variant="secondary" onClick={onDismiss}>
          {REVIEW_COPY.BULK_FAILED_DISMISS}
        </Button>
      </div>
      <ul className="rfail__list">
        {failures.map((failure) => (
          <li key={failure.id}>
            <span className="rfail__text">{failure.text}</span>: {failure.reason}
          </li>
        ))}
      </ul>
    </Alert>
  );
}
