import { Alert, Button, Drawer, Loader } from '@/components';
import { QUESTIONS_COPY } from '@/constants';
import { useQuestionDrawer } from '../hooks/useQuestionDrawer';
import type { SubmitErrorHandler, QuestionFormValues } from '../schema';
import { QuestionDrawerNotice } from './QuestionDrawerNotice';
import { QuestionForm } from './QuestionForm';

interface QuestionDrawerProps {
  isOpen: boolean;
  editingId: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    values: QuestionFormValues,
    onSuccess: () => void,
    onSubmitError?: SubmitErrorHandler,
  ) => void;
}

export function QuestionDrawer({
  isOpen,
  editingId,
  isSubmitting,
  onClose,
  onSubmit,
}: QuestionDrawerProps) {
  const { isEditing, notice, decision, initialValues, isLoading, isError, isReady, refetch } =
    useQuestionDrawer(editingId);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? QUESTIONS_COPY.EDIT_DRAWER_TITLE : QUESTIONS_COPY.DRAWER_TITLE}
      closeLabel={QUESTIONS_COPY.CLOSE}
    >
      {isLoading && <Loader label={QUESTIONS_COPY.LOADING} />}
      {isError && (
        <div className="qform">
          <Alert>{QUESTIONS_COPY.QUESTION_LOAD_ERROR}</Alert>
          <Button variant="secondary" onClick={refetch}>
            {QUESTIONS_COPY.RETRY}
          </Button>
        </div>
      )}
      {isReady && <QuestionDrawerNotice notice={notice} decision={decision} />}
      {isReady && (
        // Keyed so each question (or a fresh add) starts from its own initial values.
        <QuestionForm
          key={editingId ?? 'new'}
          initialValues={initialValues}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          checkDuplicates
          questionId={editingId ?? undefined}
          submitLabel={isEditing ? QUESTIONS_COPY.RESUBMIT : QUESTIONS_COPY.SUBMIT}
          submittingLabel={isEditing ? QUESTIONS_COPY.RESUBMITTING : QUESTIONS_COPY.SUBMITTING}
        />
      )}
    </Drawer>
  );
}
