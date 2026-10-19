import type { ReviewContent as ReviewContentValue } from '@/api';
import { REVIEW_COPY } from '@/constants';
import { formatClient, formatTags } from '../utils';

interface ReviewContentProps {
  content: ReviewContentValue;
}

// Plain text only: answer notes are untrusted, so nothing here is rendered as HTML.
export function ReviewContent({ content }: ReviewContentProps) {
  const fields = [
    { label: REVIEW_COPY.FIELD_QUESTION, value: content.text },
    { label: REVIEW_COPY.FIELD_ANSWER, value: content.answerNotes },
    { label: REVIEW_COPY.FIELD_TAGS, value: formatTags(content.tags) },
    { label: REVIEW_COPY.FIELD_CLIENT, value: formatClient(content) },
  ];

  return (
    <dl className="rcontent">
      {fields.map(({ label, value }) => (
        <div key={label} className="rcontent__row">
          <dt className="rdiff__label">{label}</dt>
          <dd className="rcontent__value">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
