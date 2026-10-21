import { Button } from '@/components';
import { REVIEW_COPY } from '@/constants';
import { useBulkActionBar } from '../hooks/useBulkActionBar';
import './BulkActionBar.css';

interface BulkActionBarProps {
  selectableCount: number;
  selectedCount: number;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onToggleAll: () => void;
  onClear: () => void;
  onApprove: () => void;
  onReject: () => void;
  isPending: boolean;
}

export function BulkActionBar({
  selectableCount,
  selectedCount,
  isAllSelected,
  isIndeterminate,
  onToggleAll,
  onClear,
  onApprove,
  onReject,
  isPending,
}: BulkActionBarProps) {
  const { checkboxRef, hasSelection } = useBulkActionBar(selectedCount, isIndeterminate);

  return (
    <div
      role="group"
      aria-label={REVIEW_COPY.BULK_BAR_LABEL}
      className={hasSelection ? 'rbulk rbulk--active' : 'rbulk'}
    >
      <label className="rbulk__all">
        <input
          ref={checkboxRef}
          type="checkbox"
          className="rcheck"
          checked={isAllSelected}
          disabled={selectableCount === 0}
          onChange={onToggleAll}
        />
        {REVIEW_COPY.BULK_SELECT_ALL}
      </label>
      <span className="rbulk__status" aria-live="polite">
        {hasSelection ? REVIEW_COPY.BULK_SELECTED(selectedCount) : REVIEW_COPY.BULK_SELECT_HINT}
      </span>
      <div className="rbulk__actions">
        {hasSelection && (
          <Button variant="secondary" onClick={onClear}>
            {REVIEW_COPY.BULK_CLEAR}
          </Button>
        )}
        <Button variant="secondary" disabled={!hasSelection || isPending} onClick={onReject}>
          {REVIEW_COPY.BULK_REJECT}
        </Button>
        <Button disabled={!hasSelection} isLoading={isPending} onClick={onApprove}>
          {REVIEW_COPY.BULK_APPROVE}
        </Button>
      </div>
      <p className="rbulk__note">{REVIEW_COPY.BULK_CHANGES_NOTE}</p>
    </div>
  );
}
