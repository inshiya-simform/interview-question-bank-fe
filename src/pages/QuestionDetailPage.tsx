import { Link } from 'react-router-dom';
import { Alert, Button, Loader } from '@/components';
import { QUESTION_DETAIL_COPY, ROUTES } from '@/constants';
import { Discussion } from '@/features/discussion';
import { QuestionDetail, QuestionDrawer } from '@/features/questions';
import { RelatedQuestions } from '@/features/related-questions';
import { QuestionHistory } from '@/features/review';
import { SaveQuestionButton } from '@/features/saved';
import { useQuestionDetailPage } from './useQuestionDetailPage';
import './QuestionDetailPage.css';

export function QuestionDetailPage() {
  const {
    questionId,
    question,
    isLoading,
    isError,
    refetch,
    isDrawerOpen,
    editingId,
    isSubmitting,
    openEditDrawer,
    closeDrawer,
    saveQuestion,
  } = useQuestionDetailPage();

  return (
    <div className="qpage">
      <Link to={ROUTES.HOME} className="qpage__back">
        <span aria-hidden="true">←</span> {QUESTION_DETAIL_COPY.BACK}
      </Link>
      {isLoading && <Loader label={QUESTION_DETAIL_COPY.LOADING} />}
      {isError && (
        <div className="qpage__error">
          <Alert>{QUESTION_DETAIL_COPY.LOAD_ERROR}</Alert>
          <Button variant="secondary" onClick={refetch}>
            {QUESTION_DETAIL_COPY.RETRY}
          </Button>
        </div>
      )}
      {question && questionId && (
        <div className="qpage__layout">
          <div className="qpage__main">
            <QuestionDetail
              question={question}
              onEdit={openEditDrawer}
              actions={<SaveQuestionButton question={question} />}
            />
            <Discussion questionId={questionId} />
          </div>
          <aside className="qpage__side" aria-label={QUESTION_DETAIL_COPY.SIDE_LABEL}>
            <RelatedQuestions question={question} />
            <div className="qpage__card">
              <QuestionHistory questionId={questionId} />
            </div>
          </aside>
        </div>
      )}
      <QuestionDrawer
        isOpen={isDrawerOpen}
        editingId={editingId}
        isSubmitting={isSubmitting}
        onClose={closeDrawer}
        onSubmit={saveQuestion}
      />
    </div>
  );
}
