import { Link } from 'react-router-dom';
import type { RelatedQuestion } from '@/api';
import { Badge, Icon } from '@/components';
import { RELATED_COPY, questionDetailPath } from '@/constants';

interface RelatedQuestionItemProps {
  item: RelatedQuestion;
}

export function RelatedQuestionItem({ item }: RelatedQuestionItemProps) {
  return (
    <Link to={questionDetailPath(item.id)} className="related__item">
      <span className="related__text">{item.text}</span>
      <span className="related__meta">
        <Badge variant="tag">{RELATED_COPY.SHARED_TAGS(item.sharedTagCount)}</Badge>
        <span>{item.tags.map((tag) => tag.name).join(', ')}</span>
      </span>
      <span className="related__comments">
        <Icon name="comment" size={13} />
        {RELATED_COPY.COMMENT_COUNT(item.commentCount)}
      </span>
    </Link>
  );
}
