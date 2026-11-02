import { getInitials } from '@/utils/initials';
import './CommentAvatar.css';

interface CommentAvatarProps {
  name: string;
}

// Decorative: the author's name is always rendered next to it.
export function CommentAvatar({ name }: CommentAvatarProps) {
  return (
    <span className="cavatar" aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}
