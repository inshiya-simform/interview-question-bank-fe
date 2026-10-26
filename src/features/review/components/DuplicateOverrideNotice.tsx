import type { DuplicateOverride } from '@/api';
import { Button } from '@/components';
import { REVIEW_COPY } from '@/constants';
import { useDuplicateOverrideNotice } from '../hooks/useDuplicateOverrideNotice';
import './DuplicateOverrideNotice.css';

interface DuplicateOverrideNoticeProps {
  override: DuplicateOverride;
  // List rows start collapsed so many matches never stretch the queue.
  isCompact?: boolean;
}

export function DuplicateOverrideNotice({
  override,
  isCompact = false,
}: DuplicateOverrideNoticeProps) {
  const { isOpen, showAll, count, hiddenCount, visibleMatches, toggleOpen, toggleShowAll } =
    useDuplicateOverrideNotice(override, isCompact);

  return (
    <section className="dupnotice">
      <h4 className="dupnotice__title">! {REVIEW_COPY.DUPLICATE_OVERRIDE_TITLE}</h4>
      {/* The reason is author-written text, rendered as plain text. */}
      <p className="dupnotice__reason">
        <span className="dupnotice__label">{REVIEW_COPY.DUPLICATE_OVERRIDE_REASON}: </span>
        {override.reason}
      </p>
      {count > 0 && (
        <>
          <button
            type="button"
            className="dupnotice__toggle"
            aria-expanded={isOpen}
            onClick={toggleOpen}
          >
            <span aria-hidden="true">{isOpen ? '▾' : '▸'} </span>
            {REVIEW_COPY.DUPLICATE_OVERRIDE_MATCHES(count)}
          </button>
          {isOpen && (
            <>
              <ul className={showAll ? 'dupnotice__list dupnotice__list--all' : 'dupnotice__list'}>
                {visibleMatches.map(({ id, text }) => (
                  <li key={id}>{text}</li>
                ))}
              </ul>
              {hiddenCount > 0 && (
                <Button variant="secondary" onClick={toggleShowAll}>
                  {showAll
                    ? REVIEW_COPY.DUPLICATE_OVERRIDE_SHOW_LESS
                    : REVIEW_COPY.DUPLICATE_OVERRIDE_SHOW_MORE(hiddenCount)}
                </Button>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
