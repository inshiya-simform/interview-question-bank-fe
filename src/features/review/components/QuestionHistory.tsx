import { Loader } from '@/components';
import { QUESTION_HISTORY_LABEL, REVIEW_COPY } from '@/constants';
import { formatDateTime } from '@/utils/date';
import { useQuestionHistory } from '../hooks/useQuestionHistory';

interface QuestionHistoryProps {
  questionId: string;
}

export function QuestionHistory({ questionId }: QuestionHistoryProps) {
  const { entries, isLoading, isError } = useQuestionHistory(questionId);

  return (
    <section aria-labelledby="rhistory-title" className="rhistory">
      <h3 id="rhistory-title" className="rhistory__title">
        {REVIEW_COPY.HISTORY_TITLE}
      </h3>
      {isLoading && <Loader />}
      {isError && <p role="alert">{REVIEW_COPY.HISTORY_ERROR}</p>}
      {!isLoading && !isError && entries.length === 0 && <p>{REVIEW_COPY.HISTORY_EMPTY}</p>}
      <ol className="rhistory__list">
        {entries.map((entry) => (
          <li key={entry.id} className="rhistory__entry">
            <strong>{QUESTION_HISTORY_LABEL[entry.action] ?? entry.action}</strong>
            <span className="rhistory__meta">
              {REVIEW_COPY.HISTORY_ENTRY(entry.actor.name, formatDateTime(entry.createdAt))}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
