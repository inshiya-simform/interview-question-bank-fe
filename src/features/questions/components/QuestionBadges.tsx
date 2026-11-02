import type { Question } from '@/api';
import { Badge } from '@/components';
import { QUESTIONS_COPY } from '@/constants';
import { cn } from '@/utils/cn';
import './QuestionBadges.css';

interface QuestionBadgesProps {
  question: Pick<Question, 'tags' | 'client'>;
  className?: string;
}

export function QuestionBadges({ question, className }: QuestionBadgesProps) {
  return (
    <ul className={cn('qbadges', className)} aria-label={QUESTIONS_COPY.FIELD_CATEGORIES}>
      {Object.entries(question.tags).map(([category, tags]) => (
        <li key={category} className="qbadges__group">
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
  );
}
