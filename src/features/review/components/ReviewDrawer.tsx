import { Alert, Drawer } from '@/components';
import { REVIEW_COPY } from '@/constants';
import { useReviewDrawer } from '../hooks/useReviewDrawer';
import { DecisionNoteModal } from './DecisionNoteModal';
import { ReviewContent } from './ReviewContent';
import { ReviewDecisionBar } from './ReviewDecisionBar';
import { ReviewDiff } from './ReviewDiff';
import { ReviewHistory } from './ReviewHistory';
import { ReviewStatusChip } from './ReviewStatusChip';
import './ReviewDrawer.css';

interface ReviewDrawerProps {
  submissionId: string | null;
  onClose: () => void;
}

export function ReviewDrawer({ submissionId, onClose }: ReviewDrawerProps) {
  const {
    submission,
    isEdit,
    canDecide,
    mode,
    approve,
    openChanges,
    openReject,
    closeModal,
    submitNote,
  } = useReviewDrawer(submissionId, onClose);

  return (
    <Drawer
      isOpen={submissionId !== null}
      onClose={onClose}
      title={REVIEW_COPY.DRAWER_TITLE}
      closeLabel={REVIEW_COPY.CLOSE}
    >
      {submissionId !== null && !submission && <Alert>{REVIEW_COPY.NOT_FOUND}</Alert>}
      {submission && (
        <div className="rdrawer">
          <ReviewStatusChip status={submission.status} isEdit={isEdit} />
          {isEdit && submission.live ? (
            <ReviewDiff live={submission.live} edit={submission.content} />
          ) : (
            <ReviewContent content={submission.content} />
          )}
          <ReviewHistory entries={submission.history} />
          {canDecide && (
            <ReviewDecisionBar
              onApprove={approve}
              onRequestChanges={openChanges}
              onReject={openReject}
            />
          )}
          <DecisionNoteModal mode={mode} onClose={closeModal} onSubmit={submitNote} />
        </div>
      )}
    </Drawer>
  );
}
