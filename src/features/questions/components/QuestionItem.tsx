import { Badge } from '@/components';
import { QUESTIONS_COPY } from '@/constants';
import { cn } from '@/utils/cn';
import type { Question } from '@/api';
import { useQuestionItem } from '../hooks/useQuestionItem';
import { EditQuestionButton } from './EditQuestionButton';
import './QuestionItem.css';

interface QuestionItemProps {
  question: Question;
  onEdit: (id: string) => void;
}

export function QuestionItem({ question, onEdit }: QuestionItemProps) {
  const { isOpen, toggle, triggerId, panelId, canEdit } = useQuestionItem(question);

  return (
    <li className={cn('qitem', isOpen && 'qitem--open')}>
      <div className="qitem__top">
        <h3 className="qitem__heading">
          <button
            type="button"
            id={triggerId}
            className="qitem__trigger"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={toggle}
          >
            <span className="qitem__text">{question.text}</span>
            <span className="qitem__chevron" aria-hidden="true" />
          </button>
        </h3>
        {canEdit && (
          <EditQuestionButton
            variant="secondary"
            aria-label={QUESTIONS_COPY.EDIT_QUESTION(question.text)}
            onClick={() => onEdit(question.id)}
          >
            {QUESTIONS_COPY.EDIT}
          </EditQuestionButton>
        )}
      </div>
      <ul className="qitem__badges" aria-label={QUESTIONS_COPY.FIELD_CATEGORIES}>
        {Object.entries(question.tags).map(([category, tags]) => (
          <li key={category} className="qitem__group">
            <Badge variant="category">{category}</Badge>
            {tags.length > 0 && <span aria-hidden="true">›</span>}
            {tags.map((tag) => (
              <Badge key={tag} variant="tag">
                {tag}
              </Badge>
            ))}
          </li>
        ))}
        {question.client && (
          <li>
            <Badge variant="client">{question.client.name}</Badge>
          </li>
        )}
      </ul>
      <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!isOpen}>
        <p className="qitem__answer">{question.answerNotes || QUESTIONS_COPY.NO_ANSWER}</p>
      </div>
    </li>
  );
}
