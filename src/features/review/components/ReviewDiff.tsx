import type { ReviewContent } from '@/api';
import { RichTextContent } from '@/components';
import { REVIEW_COPY } from '@/constants';
import { diffWords } from '@/utils/diffWords';
import { formatClient, formatTags } from '../utils';
import { DiffText } from './DiffText';

interface ReviewDiffProps {
  live: ReviewContent;
  edit: ReviewContent;
}

export function ReviewDiff({ live, edit }: ReviewDiffProps) {
  const fields = [
    { label: REVIEW_COPY.FIELD_QUESTION, before: live.text, after: edit.text },
    {
      label: REVIEW_COPY.FIELD_ANSWER,
      before: live.answerNotes,
      after: edit.answerNotes,
      isRich: true,
    },
    { label: REVIEW_COPY.FIELD_TAGS, before: formatTags(live.tags), after: formatTags(edit.tags) },
    { label: REVIEW_COPY.FIELD_CLIENT, before: formatClient(live), after: formatClient(edit) },
  ];

  return (
    <div className="rdiff">
      <div className="rdiff__heads" aria-hidden="true">
        <span>{REVIEW_COPY.SECTION_LIVE}</span>
        <span>{REVIEW_COPY.SECTION_EDIT}</span>
      </div>
      {fields.map(({ label, before, after, isRich }) => {
        // Formatting and images can't be word-diffed, so each version is shown rendered.
        const segments = isRich ? [] : diffWords(before, after);
        return (
          <section key={label} className="rdiff__field" aria-label={label}>
            <h4 className="rdiff__label">{label}</h4>
            <div className="rdiff__split">
              <div className="rdiff__pane">
                <span className="sr-only">{REVIEW_COPY.SECTION_LIVE}</span>
                {isRich ? (
                  <RichTextContent html={before} />
                ) : (
                  <DiffText segments={segments} side="before" />
                )}
              </div>
              <div className="rdiff__pane">
                <span className="sr-only">{REVIEW_COPY.SECTION_EDIT}</span>
                {isRich ? (
                  <RichTextContent html={after} />
                ) : (
                  <DiffText segments={segments} side="after" />
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
