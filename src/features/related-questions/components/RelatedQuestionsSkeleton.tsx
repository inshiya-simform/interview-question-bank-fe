import { RELATED_COPY } from '@/constants';

const SKELETON_ROWS = ['first', 'second', 'third', 'fourth', 'fifth'] as const;

export function RelatedQuestionsSkeleton() {
  return (
    <div role="status" aria-label={RELATED_COPY.LOADING}>
      {SKELETON_ROWS.map((row) => (
        <div key={row} className="related__item related__skeleton-row" aria-hidden="true">
          <span className="related__skeleton-line" />
          <span className="related__skeleton-line related__skeleton-line--short" />
        </div>
      ))}
    </div>
  );
}
