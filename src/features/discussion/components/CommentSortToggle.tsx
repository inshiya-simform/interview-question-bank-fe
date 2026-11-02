import { DISCUSSION_COPY } from '@/constants';
import { cn } from '@/utils/cn';
import { COMMENT_SORT_OPTIONS } from '../constants';
import type { CommentSort } from '../constants';
import './CommentSortToggle.css';

interface CommentSortToggleProps {
  value: CommentSort;
  onChange: (sort: CommentSort) => void;
}

export function CommentSortToggle({ value, onChange }: CommentSortToggleProps) {
  return (
    <div className="csort" role="group" aria-label={DISCUSSION_COPY.SORT_LABEL}>
      {COMMENT_SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn('csort__btn', option.value === value && 'csort__btn--active')}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
