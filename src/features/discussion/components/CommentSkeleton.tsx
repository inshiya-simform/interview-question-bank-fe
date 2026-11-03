import { DISCUSSION_COPY } from '@/constants';
import './CommentSkeleton.css';

const SKELETON_ROWS = ['first', 'second', 'third'] as const;

export function CommentSkeleton() {
  return (
    <div className="cskeleton" role="status" aria-label={DISCUSSION_COPY.LOADING}>
      {SKELETON_ROWS.map((row) => (
        <div key={row} className="cskeleton__row" aria-hidden="true">
          <span className="cskeleton__avatar" />
          <span className="cskeleton__lines">
            <span className="cskeleton__line cskeleton__line--short" />
            <span className="cskeleton__line" />
            <span className="cskeleton__line" />
          </span>
        </div>
      ))}
    </div>
  );
}
