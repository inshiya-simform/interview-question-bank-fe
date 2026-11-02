import type { ReactNode } from 'react';
import type { Question } from '@/api';
import { Icon, RichTextContent } from '@/components';
import { QUESTION_DETAIL_COPY, QUESTIONS_COPY } from '@/constants';
import { ReviewStatusChip } from '@/features/review';
import { useQuestionDetail } from '../hooks/useQuestionDetail';
import { EditQuestionButton } from './EditQuestionButton';
import { QuestionBadges } from './QuestionBadges';
import './QuestionDetail.css';

interface QuestionDetailProps {
  question: Question;
  onEdit: (id: string) => void;
  // Feature-supplied controls (e.g. Save) rendered beside Edit, so this feature stays decoupled.
  actions?: ReactNode;
}

export function QuestionDetail({ question, onEdit, actions }: QuestionDetailProps) {
  const { canEdit, reviewChip, addedLabel, updatedLabel } = useQuestionDetail(question);

  return (
    <article className="qdetail">
      <QuestionBadges question={question} />
      <div className="qdetail__top">
        <h1 className="qdetail__title">{question.text}</h1>
        <div className="qdetail__actions">
          {reviewChip && <ReviewStatusChip status={reviewChip.status} isEdit={reviewChip.isEdit} />}
          {actions}
          {canEdit && (
            <EditQuestionButton variant="secondary" onClick={() => onEdit(question.id)}>
              <Icon name="edit" size={16} />
              {QUESTIONS_COPY.EDIT}
            </EditQuestionButton>
          )}
        </div>
      </div>
      <p className="qdetail__meta">
        {addedLabel} · {updatedLabel}
      </p>
      <section className="qdetail__answer" aria-labelledby="qdetail-answer-title">
        <h2 id="qdetail-answer-title" className="qdetail__answer-title">
          {QUESTION_DETAIL_COPY.ANSWER_TITLE}
        </h2>
        {question.answerNotes ? (
          <RichTextContent html={question.answerNotes} />
        ) : (
          <p className="qdetail__empty">{QUESTIONS_COPY.NO_ANSWER}</p>
        )}
      </section>
    </article>
  );
}
