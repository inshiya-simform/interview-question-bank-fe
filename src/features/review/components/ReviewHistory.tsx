import type { HistoryEntry } from '@/api';
import { REVIEW_COPY, REVIEW_HISTORY_LABEL } from '@/constants';
import { formatDateTime } from '@/utils/date';

interface ReviewHistoryProps {
  entries: HistoryEntry[];
}

export function ReviewHistory({ entries }: ReviewHistoryProps) {
  return (
    <section aria-labelledby="rhistory-title" className="rhistory">
      <h3 id="rhistory-title" className="rhistory__title">
        {REVIEW_COPY.HISTORY_TITLE}
      </h3>
      <ol className="rhistory__list">
        {entries.map((entry) => (
          <li key={entry.id} className="rhistory__entry">
            <strong>{REVIEW_HISTORY_LABEL[entry.event]}</strong>
            <span className="rhistory__meta">
              {REVIEW_COPY.HISTORY_ENTRY(entry.actor.name, formatDateTime(entry.at))}
            </span>
            {entry.note && <p className="rhistory__note">{entry.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
