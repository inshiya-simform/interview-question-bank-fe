import { REVIEW_COPY } from '@/constants';
import { useReviewQueue } from '../hooks/useReviewQueue';
import { ReviewDrawer } from './ReviewDrawer';
import { ReviewListFrame } from './ReviewListFrame';
import { ReviewQueueRow } from './ReviewQueueRow';

export function ReviewQueue() {
  const {
    tabs,
    activeTab,
    counts,
    items,
    total,
    page,
    totalPages,
    selectedId,
    setStatus,
    setPage,
    openReview,
    closeReview,
  } = useReviewQueue();

  return (
    <>
      <ReviewListFrame
        title={REVIEW_COPY.QUEUE_TITLE}
        emptyText={REVIEW_COPY.EMPTY_QUEUE}
        tabs={tabs}
        activeTab={activeTab}
        counts={counts}
        onTabChange={setStatus}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      >
        <ul className="rlist">
          {items.map((submission) => (
            <ReviewQueueRow key={submission.id} submission={submission} onReview={openReview} />
          ))}
        </ul>
      </ReviewListFrame>
      <ReviewDrawer submissionId={selectedId} onClose={closeReview} />
    </>
  );
}
