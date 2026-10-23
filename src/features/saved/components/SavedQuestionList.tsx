import { Link } from 'react-router-dom';
import { Pagination } from '@/components';
import { QUESTIONS_COPY, ROUTES, SAVED_COPY } from '@/constants';
import { QuestionItem } from '@/features/questions';
import { useSavedQuestionList } from '../hooks/useSavedQuestionList';
import { SaveQuestionButton } from './SaveQuestionButton';
import { UnsaveButton } from './UnsaveButton';
import './SavedQuestionList.css';

interface SavedQuestionListProps {
  collectionId?: string;
  page: number;
  onPageChange: (page: number) => void;
}

export function SavedQuestionList({ collectionId, page, onPageChange }: SavedQuestionListProps) {
  const { questions, totalPages } = useSavedQuestionList({ collectionId, page });

  return (
    <div className="slist">
      {questions.length === 0 ? (
        <div className="slist__empty">
          <h3 className="slist__empty-title">{SAVED_COPY.EMPTY_TITLE}</h3>
          <p className="slist__empty-hint">{SAVED_COPY.EMPTY_HINT}</p>
          <Link to={ROUTES.HOME} className="slist__browse">
            {SAVED_COPY.BROWSE}
          </Link>
        </div>
      ) : (
        <ul className="slist__items">
          {questions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              actions={
                <>
                  <SaveQuestionButton question={question} mode="move" />
                  <UnsaveButton question={question} />
                </>
              }
            />
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          label={QUESTIONS_COPY.PAGINATION_LABEL}
          previousLabel={QUESTIONS_COPY.PREVIOUS_PAGE}
          nextLabel={QUESTIONS_COPY.NEXT_PAGE}
          pageLabel={QUESTIONS_COPY.PAGE_NUMBER}
          statusLabel={QUESTIONS_COPY.PAGE_STATUS(page, totalPages)}
        />
      )}
    </div>
  );
}
