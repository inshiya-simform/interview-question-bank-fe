import type { ReviewedQuestion } from '@/api';
import { Alert, Drawer } from '@/components';
import { REVIEW_COPY } from '@/constants';
import { ReviewDrawerContent } from './ReviewDrawerContent';
import './ReviewDrawer.css';

interface ReviewDrawerProps {
  isOpen: boolean;
  submission: ReviewedQuestion | undefined;
  onClose: () => void;
  onReload: () => void;
}

export function ReviewDrawer({ isOpen, submission, onClose, onReload }: ReviewDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={REVIEW_COPY.DRAWER_TITLE}
      closeLabel={REVIEW_COPY.CLOSE}
    >
      {isOpen && !submission && <Alert>{REVIEW_COPY.NOT_FOUND}</Alert>}
      {submission && (
        <ReviewDrawerContent
          key={submission.id}
          submission={submission}
          onClose={onClose}
          onReload={onReload}
        />
      )}
    </Drawer>
  );
}
