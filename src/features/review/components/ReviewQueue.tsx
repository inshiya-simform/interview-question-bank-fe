import { REVIEW_COPY } from '@/constants';
import { DECISION_MODE } from '../constants';
import { useBulkDecision } from '../hooks/useBulkDecision';
import { useBulkSelection } from '../hooks/useBulkSelection';
import { useReviewQueue } from '../hooks/useReviewQueue';
import { BulkActionBar } from './BulkActionBar';
import { DecisionNoteModal } from './DecisionNoteModal';
import { ReviewDrawer } from './ReviewDrawer';
import { ReviewListFrame } from './ReviewListFrame';
import { ReviewQueueRow } from './ReviewQueueRow';

export function ReviewQueue() {
  const { items, selectedId, selected, setStatus, setPage, openReview, closeReview, ...list } =
    useReviewQueue();
  const bulk = useBulkSelection(items);
  const decision = useBulkDecision(bulk.selectedIds, bulk.clear);

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
        <ul className="rlist">
          {items.map((submission) => (
            <ReviewQueueRow
              key={submission.id}
              submission={submission}
              onReview={openReview}
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
      <ReviewDrawer isOpen={selectedId !== null} submission={selected} onClose={closeReview} />
    </>
  );
}
