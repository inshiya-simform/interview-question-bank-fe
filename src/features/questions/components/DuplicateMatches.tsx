import type { DuplicateMatch } from '@/api';
import { TextAreaField } from '@/components';
import { QUESTIONS_COPY } from '@/constants';
import './DuplicateMatches.css';

interface DuplicateMatchesProps {
  matches: DuplicateMatch[];
  isChecking: boolean;
  isConfirmed: boolean;
  onConfirmChange: (confirmed: boolean) => void;
  reason: string;
  reasonError?: string;
  onReasonChange: (reason: string) => void;
}

export function DuplicateMatches({
  matches,
  isChecking,
  isConfirmed,
  onConfirmChange,
  reason,
  reasonError,
  onReasonChange,
}: DuplicateMatchesProps) {
  return (
    <div
      className="dupes"
      role="region"
      aria-live="polite"
      aria-label={QUESTIONS_COPY.DUPLICATE_REGION_LABEL}
    >
      {isChecking && matches.length === 0 && (
        <p className="dupes__status">{QUESTIONS_COPY.DUPLICATE_CHECKING}</p>
      )}
      {matches.length > 0 && (
        <div className="dupes__panel">
          <p className="dupes__heading">{QUESTIONS_COPY.DUPLICATE_HEADING}</p>
          <ul className="dupes__list">
            {matches.map(({ id, text, similarity }) => (
              <li key={id} className="dupes__item">
                <span>{text}</span>
                <span className="dupes__similarity">
                  {QUESTIONS_COPY.DUPLICATE_SIMILARITY(similarity)}
                </span>
              </li>
            ))}
          </ul>
          <label className="dupes__confirm">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(event) => onConfirmChange(event.target.checked)}
            />
            {QUESTIONS_COPY.DUPLICATE_CONFIRM}
          </label>
          {isConfirmed && (
            <TextAreaField
              label={QUESTIONS_COPY.DUPLICATE_REASON_LABEL}
              name="distinctReason"
              placeholder={QUESTIONS_COPY.DUPLICATE_REASON_PLACEHOLDER}
              rows={3}
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              error={reasonError}
            />
          )}
        </div>
      )}
    </div>
  );
}
