import { REVIEW_COPY } from '@/constants';
import { useReviewQueue } from '../hooks/useReviewQueue';
import { ReviewDrawer } from './ReviewDrawer';
import { ReviewListFrame } from './ReviewListFrame';
import { ReviewQueueRow } from './ReviewQueueRow';

export function ReviewQueue() {
  const { items, selectedId, selected, setStatus, setPage, openReview, closeReview, ...list } =
    useReviewQueue();

  return (
    <>
      <ReviewListFrame
        title={REVIEW_COPY.QUEUE_TITLE}
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
        <ul className="rlist">
          {items.map((submission) => (
            <ReviewQueueRow key={submission.id} submission={submission} onReview={openReview} />
          ))}
        </ul>
      </ReviewListFrame>
      <ReviewDrawer isOpen={selectedId !== null} submission={selected} onClose={closeReview} />
    </>
  );
}
