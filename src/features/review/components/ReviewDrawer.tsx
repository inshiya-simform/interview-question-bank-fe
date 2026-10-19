import type { ReviewedQuestion } from '@/api';
import { Alert, Drawer } from '@/components';
import { REVIEW_COPY } from '@/constants';
import { useReviewDrawer } from '../hooks/useReviewDrawer';
import { DecisionNoteModal } from './DecisionNoteModal';
import { ReviewContent } from './ReviewContent';
import { QuestionHistory } from './QuestionHistory';
import { ReviewDecisionBar } from './ReviewDecisionBar';
import { ReviewDiff } from './ReviewDiff';
import { ReviewStatusChip } from './ReviewStatusChip';
import './ReviewDrawer.css';

interface ReviewDrawerProps {
  isOpen: boolean;
  submission: ReviewedQuestion | undefined;
  onClose: () => void;
}

export function ReviewDrawer({ isOpen, submission, onClose }: ReviewDrawerProps) {
  const {
    isEdit,
    content,
    live,
    canDecide,
    isPending,
    mode,
    approve,
    openChanges,
    openReject,
    closeModal,
    submitNote,
  } = useReviewDrawer(submission, onClose);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={REVIEW_COPY.DRAWER_TITLE}
      closeLabel={REVIEW_COPY.CLOSE}
    >
      {isOpen && !submission && <Alert>{REVIEW_COPY.NOT_FOUND}</Alert>}
      {submission && content && live && (
        <div className="rdrawer">
          <ReviewStatusChip status={submission.status} isEdit={isEdit} />
          {isEdit ? <ReviewDiff live={live} edit={content} /> : <ReviewContent content={content} />}
          <QuestionHistory questionId={submission.id} />
          {canDecide && (
            <ReviewDecisionBar
              onApprove={approve}
              onRequestChanges={openChanges}
              onReject={openReject}
              isPending={isPending}
            />
          )}
          <DecisionNoteModal
            mode={mode}
            isPending={isPending}
            onClose={closeModal}
            onSubmit={submitNote}
          />
        </div>
      )}
    </Drawer>
  );
}
