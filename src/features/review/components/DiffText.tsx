import { REVIEW_COPY } from '@/constants';
import type { DiffSegment } from '@/utils/diffWords';

interface DiffTextProps {
  segments: DiffSegment[];
  // "before" shows what was removed; "after" shows what was added.
  side: 'before' | 'after';
}

// Marks use strikethrough and a heavy underline, with hidden text for screen readers.
export function DiffText({ segments, side }: DiffTextProps) {
  const hidden = side === 'before' ? 'added' : 'removed';

  return (
    <p className="rdiff__text">
      {segments
        .filter((segment) => segment.type !== hidden)
        .map((segment, index) => {
          if (segment.type === 'same') return <span key={index}>{segment.text}</span>;
          const Mark = segment.type === 'removed' ? 'del' : 'ins';
          const label =
            segment.type === 'removed' ? REVIEW_COPY.DIFF_REMOVED : REVIEW_COPY.DIFF_ADDED;
          return (
            <Mark key={index}>
              <span className="sr-only">{label} </span>
              {segment.text}
            </Mark>
          );
        })}
    </p>
  );
}
