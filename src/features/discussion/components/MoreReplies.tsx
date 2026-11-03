import { Alert, Button } from '@/components';
import { DISCUSSION_COPY } from '@/constants';

interface MoreRepliesProps {
  remaining: number;
  authorName: string;
  isLoading: boolean;
  isError: boolean;
  onClick: () => void;
}

export function MoreReplies({
  remaining,
  authorName,
  isLoading,
  isError,
  onClick,
}: MoreRepliesProps) {
  return (
    <div className="cthread__more">
      {isError && !isLoading && <Alert>{DISCUSSION_COPY.REPLIES_LOAD_ERROR}</Alert>}
      <Button
        variant="secondary"
        isLoading={isLoading}
        aria-label={
          isError
            ? DISCUSSION_COPY.REPLIES_RETRY_LABEL(authorName)
            : DISCUSSION_COPY.VIEW_MORE_REPLIES_LABEL(remaining, authorName)
        }
        onClick={onClick}
      >
        {isError ? DISCUSSION_COPY.REPLIES_RETRY : DISCUSSION_COPY.VIEW_MORE_REPLIES(remaining)}
      </Button>
    </div>
  );
}
