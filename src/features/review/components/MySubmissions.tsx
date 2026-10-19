import { REVIEW_COPY } from '@/constants';
import { useMySubmissions } from '../hooks/useMySubmissions';
import { ReviewListFrame } from './ReviewListFrame';
import { SubmissionItem } from './SubmissionItem';

interface MySubmissionsProps {
  onEdit: (id: string) => void;
}

export function MySubmissions({ onEdit }: MySubmissionsProps) {
  const { tabs, activeTab, counts, items, total, page, totalPages, setStatus, setPage } =
    useMySubmissions();

  return (
    <ReviewListFrame
      title={REVIEW_COPY.MY_TITLE}
      emptyText={REVIEW_COPY.EMPTY_MINE}
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
          <SubmissionItem key={submission.id} submission={submission} onEdit={onEdit} />
        ))}
      </ul>
    </ReviewListFrame>
  );
}
