import { REVIEW_COPY } from '@/constants';
import { DECISION_MODE } from '../constants';
import { useBulkDecision } from '../hooks/useBulkDecision';
import { useBulkSelection } from '../hooks/useBulkSelection';
import { useReviewQueue } from '../hooks/useReviewQueue';
import { BulkActionBar } from './BulkActionBar';
import { BulkFailureList } from './BulkFailureList';
import { DecisionNoteModal } from './DecisionNoteModal';
import { ReviewDrawer } from './ReviewDrawer';
import { ReviewListFrame } from './ReviewListFrame';
import { ReviewQueueRow } from './ReviewQueueRow';

export function ReviewQueue() {
  const {
    items,
    selected,
    setStatus,
    setPage,
    openReview,
    closeReview,
    reloadSelected,
    lockOwnerOf,
    ...list
  } = useReviewQueue();
  const bulk = useBulkSelection(items, (item) => Boolean(lockOwnerOf(item)));
  const decision = useBulkDecision(items, bulk.selectedIds, bulk.clear);

  return (
    <>
      <ReviewListFrame
        title={REVIEW_COPY.QUEUE_TITLE}
        subtitle={REVIEW_COPY.QUEUE_SUBTITLE}
        emptyText={REVIEW_COPY.EMPTY_QUEUE}
        tabs={list.tabs}
        activeTab={list.activeTab}
        counts={list.counts}
        onTabChange={setStatus}
        total={list.total}
        page={list.page}
        totalPages={list.totalPages}
        onPageChange={setPage}
        isLoading={list.isLoading}
        isError={list.isError}
        onRetry={list.refetch}
      >
        {bulk.selectableIds.length > 0 && (
          <BulkActionBar
            selectableCount={bulk.selectableIds.length}
            selectedCount={bulk.selectedIds.length}
            isAllSelected={bulk.isAllSelected}
            isIndeterminate={bulk.isIndeterminate}
            onToggleAll={bulk.toggleAll}
            onClear={bulk.clear}
            onApprove={decision.approve}
            onReject={decision.openReject}
            isPending={decision.isPending}
          />
        )}
        {decision.failures.length > 0 && (
          <BulkFailureList failures={decision.failures} onDismiss={decision.dismissFailures} />
        )}
        <ul className="rlist">
          {items.map((submission) => (
            <ReviewQueueRow
              key={submission.id}
              submission={submission}
              onReview={openReview}
              lockOwner={lockOwnerOf(submission)}
              isSelected={bulk.isSelected(submission.id)}
              onToggle={bulk.toggle}
            />
          ))}
        </ul>
      </ReviewListFrame>
      <DecisionNoteModal
        mode={decision.isRejecting ? DECISION_MODE.REJECT : null}
        isPending={decision.isRejectPending}
        onClose={decision.closeReject}
        onSubmit={decision.reject}
      />
      <ReviewDrawer
        isOpen={selected !== undefined}
        submission={selected}
        onClose={closeReview}
        onReload={() => void reloadSelected()}
      />
    </>
  );
}
