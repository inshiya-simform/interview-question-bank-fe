import { Drawer } from '@/components';
import { QUESTIONS_COPY, REVIEW_COPY, REVIEW_STATUS } from '@/constants';
import { useSubmissionEditDrawer } from '../hooks/useSubmissionEditDrawer';
import { QuestionDrawerNotice } from './QuestionDrawerNotice';
import { NOTICE } from '../constants';
import { QuestionForm } from './QuestionForm';

interface SubmissionEditDrawerProps {
  submissionId: string | null;
  onClose: () => void;
}

export function SubmissionEditDrawer({ submissionId, onClose }: SubmissionEditDrawerProps) {
  const { submission, initialValues, isReady, resubmit } = useSubmissionEditDrawer(
    submissionId,
    onClose,
  );
  const hasChangeRequest =
    submission?.status === REVIEW_STATUS.CHANGES_REQUESTED && Boolean(submission.decision);
  // Only an edit of a live question carries the "stays visible" guarantee.
  const notice = hasChangeRequest ? NOTICE.CHANGES : submission?.live ? NOTICE.LIVE_EDIT : null;

  return (
    <Drawer
      isOpen={submissionId !== null}
      onClose={onClose}
      title={REVIEW_COPY.EDIT_DRAWER_TITLE}
      closeLabel={QUESTIONS_COPY.CLOSE}
    >
      {isReady && submission && (
        <>
          <QuestionDrawerNotice notice={notice} decision={submission.decision} />
          <QuestionForm
            key={submission.id}
            initialValues={initialValues}
            onSubmit={resubmit}
            onCancel={onClose}
            isSubmitting={false}
            submitLabel={QUESTIONS_COPY.RESUBMIT}
            submittingLabel={QUESTIONS_COPY.RESUBMITTING}
          />
        </>
      )}
    </Drawer>
  );
}
