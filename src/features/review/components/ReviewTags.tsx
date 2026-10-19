import { Badge } from '@/components';
import type { ReviewContent } from '@/api';
import './ReviewTags.css';

interface ReviewTagsProps {
  tags: ReviewContent['tags'];
}

export function ReviewTags({ tags }: ReviewTagsProps) {
  return (
    <ul className="rtags">
      {Object.entries(tags).map(([category, names]) => (
        <li key={category} className="rtags__group">
          <Badge variant="category">{category}</Badge>
          {names.map((name) => (
            <Badge key={name} variant="tag">
              {name}
            </Badge>
          ))}
        </li>
      ))}
    </ul>
  );
}
