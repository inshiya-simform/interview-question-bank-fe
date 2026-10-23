import type { Question } from '@/api';
import { Button, Icon } from '@/components';
import { SAVED_COPY } from '@/constants';
import { useUnsaveButton } from '../hooks/useUnsaveButton';

interface UnsaveButtonProps {
  question: Pick<Question, 'id' | 'text'>;
}

export function UnsaveButton({ question }: UnsaveButtonProps) {
  const { unsave, isPending } = useUnsaveButton(question.id);

  return (
    <Button
      variant="secondary"
      isLoading={isPending}
      aria-label={SAVED_COPY.UNSAVE_ARIA(question.text)}
      onClick={unsave}
    >
      <Icon name="bookmark" size={16} />
      {SAVED_COPY.UNSAVE}
    </Button>
  );
}
