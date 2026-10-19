import type { ReviewedQuestion } from '@/api';
import { Drawer } from '@/components';
import { QUESTIONS_COPY, REVIEW_COPY, REVIEW_STATUS } from '@/constants';
import { toDecision } from '@/features/review';
import { useSubmissionEditDrawer } from '../hooks/useSubmissionEditDrawer';
import { QuestionDrawerNotice } from './QuestionDrawerNotice';
import { NOTICE } from '../constants';
import { QuestionForm } from './QuestionForm';

interface SubmissionEditDrawerProps {
  submission: ReviewedQuestion | null;
  onClose: () => void;
}

export function SubmissionEditDrawer({ submission, onClose }: SubmissionEditDrawerProps) {
  const { initialValues, isReady, isSubmitting, resubmit } = useSubmissionEditDrawer(
    submission,
    onClose,
  );
  const decision = submission ? toDecision(submission) : null;
  const hasChangeRequest =
    submission?.status === REVIEW_STATUS.CHANGES_REQUESTED && Boolean(decision);
  // Only an edit of a live question carries the "stays visible" guarantee.
  const notice = hasChangeRequest ? NOTICE.CHANGES : submission?.isLive ? NOTICE.LIVE_EDIT : null;

  return (
    <Drawer
      isOpen={submission !== null}
      onClose={onClose}
      title={REVIEW_COPY.EDIT_DRAWER_TITLE}
      closeLabel={QUESTIONS_COPY.CLOSE}
    >
      {isReady && submission && (
        <>
          <QuestionDrawerNotice notice={notice} decision={decision} />
          <QuestionForm
            key={submission.id}
            initialValues={initialValues}
            onSubmit={resubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            submitLabel={QUESTIONS_COPY.RESUBMIT}
            submittingLabel={QUESTIONS_COPY.RESUBMITTING}
          />
        </>
      )}
    </Drawer>
  );
}
