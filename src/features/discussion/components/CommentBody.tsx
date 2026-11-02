import type { BodyPart } from '../utils';
import './CommentBody.css';

interface CommentBodyProps {
  parts: readonly BodyPart[];
}

// Comments are untrusted text: React escapes every part, nothing is rendered as HTML.
export function CommentBody({ parts }: CommentBodyProps) {
  return (
    <p className="cbody">
      {parts.map((part) =>
        part.isMention ? (
          <span key={part.key} className="cbody__mention">
            {part.text}
          </span>
        ) : (
          <span key={part.key}>{part.text}</span>
        ),
      )}
    </p>
  );
}
