import type { ReviewedQuestion } from '@/api';
import { useReviewDrawer } from '../hooks/useReviewDrawer';
import { DecisionNoteModal } from './DecisionNoteModal';
import { DuplicateOverrideNotice } from './DuplicateOverrideNotice';
import { ReviewContent } from './ReviewContent';
import { QuestionHistory } from './QuestionHistory';
import { ReviewDecisionBar } from './ReviewDecisionBar';
import { ReviewDiff } from './ReviewDiff';
import { ReviewLockBanner } from './ReviewLockBanner';
import { ReviewStatusChip } from './ReviewStatusChip';

interface ReviewDrawerContentProps {
  submission: ReviewedQuestion;
  onClose: () => void;
  onReload: () => void;
}

// Mounted per question, so the lock lifecycle starts on open and ends on close.
export function ReviewDrawerContent({ submission, onClose, onReload }: ReviewDrawerContentProps) {
  const {
    isEdit,
    content,
    live,
    canDecide,
    canAct,
    banner,
    isClaiming,
    runBannerAction,
    isPending,
    mode,
    approve,
    openChanges,
    openReject,
    closeModal,
    submitNote,
  } = useReviewDrawer(submission, onClose, onReload);

  const bannerNode = banner && (
    <ReviewLockBanner banner={banner} isClaiming={isClaiming} onAction={runBannerAction} />
  );

  const overrideNode = submission.duplicateOverride && (
    <DuplicateOverrideNotice override={submission.duplicateOverride} />
  );

  return (
    <div className="rdrawer">
      {bannerNode}
      {overrideNode}
      <ReviewStatusChip status={submission.status} isEdit={isEdit} />
      {isEdit ? <ReviewDiff live={live} edit={content} /> : <ReviewContent content={content} />}
      <QuestionHistory questionId={submission.id} />
      {canDecide && (
        <ReviewDecisionBar
          onApprove={approve}
          onRequestChanges={openChanges}
          onReject={openReject}
          isPending={isPending}
          isDisabled={!canAct}
        />
      )}
      <DecisionNoteModal
        mode={mode}
        isPending={isPending}
        isDisabled={!canAct}
        notice={
          <>
            {bannerNode}
            {overrideNode}
          </>
        }
        onClose={closeModal}
        onSubmit={submitNote}
      />
    </div>
  );
}
