import { REVIEW_EDIT_STATUS_LABEL, REVIEW_STATUS_GLYPH, REVIEW_STATUS_LABEL } from '@/constants';
import type { ReviewStatus } from '@/constants';
import { cn } from '@/utils/cn';
import './ReviewStatusChip.css';

interface ReviewStatusChipProps {
  status: ReviewStatus;
  // An edit of a question that is already live.
  isEdit?: boolean;
}

export function ReviewStatusChip({ status, isEdit = false }: ReviewStatusChipProps) {
  const label = isEdit ? REVIEW_EDIT_STATUS_LABEL[status] : REVIEW_STATUS_LABEL[status];

  return (
    <span className={cn('rchip', `rchip--${status.toLowerCase()}`, isEdit && 'rchip--edit')}>
      <span aria-hidden="true">{isEdit ? '↻' : REVIEW_STATUS_GLYPH[status]}</span>
      {label}
    </span>
  );
}
