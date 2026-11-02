import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '@/api';
import { QUESTIONS_COPY, questionDetailPath } from '@/constants';
import { ReviewStatusChip } from '@/features/review';
import { useQuestionAccess } from '../hooks/useQuestionAccess';
import { EditQuestionButton } from './EditQuestionButton';
import { QuestionBadges } from './QuestionBadges';
import './QuestionItem.css';

interface QuestionItemProps {
  question: Question;
  // Omit to hide Edit, e.g. where the question can't be edited in place.
  onEdit?: (id: string) => void;
  // Feature-supplied controls (e.g. Save) rendered beside Edit, so this feature stays decoupled.
  actions?: ReactNode;
}

export function QuestionItem({ question, onEdit, actions }: QuestionItemProps) {
  const { canEdit, reviewChip } = useQuestionAccess(question);

  return (
    <li className="qitem">
      <div className="qitem__top">
        <h3 className="qitem__heading">
          <Link to={questionDetailPath(question.id)} className="qitem__link">
            {question.text}
          </Link>
        </h3>
        {reviewChip && <ReviewStatusChip status={reviewChip.status} isEdit={reviewChip.isEdit} />}
        {actions}
        {canEdit && onEdit && (
          <EditQuestionButton
            variant="secondary"
            aria-label={QUESTIONS_COPY.EDIT_QUESTION(question.text)}
            onClick={() => onEdit(question.id)}
          >
            {QUESTIONS_COPY.EDIT}
          </EditQuestionButton>
        )}
      </div>
      <QuestionBadges question={question} className="qitem__badges" />
    </li>
  );
}
