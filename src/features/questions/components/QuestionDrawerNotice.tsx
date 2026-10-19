import type { ReviewDecision } from '@/api';
import { QUESTIONS_COPY, REVIEW_STATUS } from '@/constants';
import { ChangeRequestBanner } from '@/features/review';
import { NOTICE } from '../constants';
import type { Notice } from '../constants';
import './QuestionDrawerNotice.css';

interface QuestionDrawerNoticeProps {
  notice: Notice | null;
  decision?: ReviewDecision | null;
}

export function QuestionDrawerNotice({ notice, decision }: QuestionDrawerNoticeProps) {
  if (notice === null) return null;

  switch (notice) {
    case NOTICE.NEW:
      return <p className="qnotice">{QUESTIONS_COPY.NOTICE_NEW}</p>;
    case NOTICE.LIVE_EDIT:
      return (
        <p className="qnotice">
          <strong>{QUESTIONS_COPY.NOTICE_EDIT_LIVE_TITLE}.</strong>{' '}
          {QUESTIONS_COPY.NOTICE_EDIT_LIVE}
        </p>
      );
    case NOTICE.CHANGES:
      return decision ? (
        <ChangeRequestBanner status={REVIEW_STATUS.CHANGES_REQUESTED} decision={decision} />
      ) : null;
    default: {
      const unreachable: never = notice;
      return unreachable;
    }
  }
}
