import { Link } from 'react-router-dom';
import type { Question } from '@/api';
import { Alert, Button, Icon, Loader } from '@/components';
import { RELATED_COPY, questionDetailPath } from '@/constants';
import { useRelatedQuestions } from '../hooks/useRelatedQuestions';
import './RelatedQuestions.css';

interface RelatedQuestionsProps {
  question: Pick<Question, 'id' | 'tags'>;
}

export function RelatedQuestions({ question }: RelatedQuestionsProps) {
  const { related, isLoading, isError, hasData, refetch } = useRelatedQuestions(question);

  return (
    <section className="related" aria-labelledby="related-title">
      <header className="related__head">
        <h2 id="related-title" className="related__title">
          {RELATED_COPY.TITLE}
        </h2>
        <p className="related__subtitle">{RELATED_COPY.SUBTITLE}</p>
      </header>
      {isLoading && <Loader label={RELATED_COPY.LOADING} />}
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
              <Link to={questionDetailPath(item.id)} className="related__item">
                <span className="related__text">{item.text}</span>
                <span className="related__meta">
                  <span className="related__shared">
                    {RELATED_COPY.SHARED_TAGS(item.sharedTags.length)}
                  </span>
                  <span>{item.sharedTags.join(', ')}</span>
                </span>
                <span className="related__comments">
                  <Icon name="comment" size={13} />
                  {RELATED_COPY.COMMENT_COUNT(item.commentCount)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
