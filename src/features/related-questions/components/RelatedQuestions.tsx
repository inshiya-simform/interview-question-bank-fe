import type { Question } from '@/api';
import { Alert, Button } from '@/components';
import { RELATED_COPY } from '@/constants';
import { useRelatedQuestions } from '../hooks/useRelatedQuestions';
import { RelatedQuestionItem } from './RelatedQuestionItem';
import { RelatedQuestionsSkeleton } from './RelatedQuestionsSkeleton';
import './RelatedQuestions.css';

interface RelatedQuestionsProps {
  question: Pick<Question, 'id'>;
}

export function RelatedQuestions({ question }: RelatedQuestionsProps) {
  const { related, isLoading, isError, hasData, refetch } = useRelatedQuestions(question.id);

  return (
    <section className="related" aria-labelledby="related-title">
      <header className="related__head">
        <h2 id="related-title" className="related__title">
          {RELATED_COPY.TITLE}
        </h2>
        <p className="related__subtitle">{RELATED_COPY.SUBTITLE}</p>
      </header>
      {isLoading && <RelatedQuestionsSkeleton />}
      {isError && !hasData && (
        <div className="related__state">
          <Alert>{RELATED_COPY.LOAD_ERROR}</Alert>
          <Button variant="secondary" onClick={refetch}>
            {RELATED_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && related.length === 0 && <p className="related__empty">{RELATED_COPY.EMPTY}</p>}
      {related.length > 0 && (
        <ol className="related__list">
          {related.map((item) => (
            <li key={item.id}>
              <RelatedQuestionItem item={item} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
