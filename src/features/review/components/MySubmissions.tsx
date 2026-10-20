import type { ReviewedQuestion } from '@/api';
import { REVIEW_COPY } from '@/constants';
import { useMySubmissions } from '../hooks/useMySubmissions';
import { ReviewListFrame } from './ReviewListFrame';
import { SubmissionItem } from './SubmissionItem';

interface MySubmissionsProps {
  onEdit: (submission: ReviewedQuestion) => void;
}

export function MySubmissions({ onEdit }: MySubmissionsProps) {
  const { items, setStatus, setPage, ...list } = useMySubmissions();

  return (
    <ReviewListFrame
      title={REVIEW_COPY.MY_TITLE}
      subtitle={REVIEW_COPY.MY_SUBTITLE}
      emptyText={REVIEW_COPY.EMPTY_MINE}
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
          <SubmissionItem key={submission.id} submission={submission} onEdit={onEdit} />
        ))}
      </ul>
    </ReviewListFrame>
  );
}
