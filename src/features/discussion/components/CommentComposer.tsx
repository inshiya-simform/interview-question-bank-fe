import { Button, TextAreaField } from '@/components';
import { DISCUSSION_COPY } from '@/constants';
import { useCommentComposer } from '../hooks/useCommentComposer';
import type { CommentInput, MentionUser } from '../schema';
import { MentionMenu } from './MentionMenu';
import './CommentComposer.css';

interface CommentComposerProps {
  users: readonly MentionUser[];
  label: string;
  placeholder: string;
  submitLabel: string;
  isPending: boolean;
  onSubmit: (input: CommentInput, onSuccess: () => void) => void;
  initialValue?: string;
  hint?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}

export function CommentComposer({
  users,
  label,
  placeholder,
  submitLabel,
  isPending,
  onSubmit,
  initialValue = '',
  hint,
  autoFocus = false,
  onCancel,
}: CommentComposerProps) {
  const composer = useCommentComposer({ users, initialValue, autoFocus, isPending, onSubmit });

  return (
    <form className="ccomposer" onSubmit={composer.submit} noValidate>
      <div className="ccomposer__box">
        <TextAreaField
          label={label}
          name="comment"
          hideLabel
          rows={3}
          placeholder={placeholder}
          value={composer.body}
          error={composer.error}
          inputRef={composer.inputRef}
          onChange={composer.onChange}
          onSelect={composer.onSelect}
          onKeyDown={composer.onKeyDown}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={composer.isMenuOpen}
          aria-controls={composer.hasOptions ? composer.listId : undefined}
          aria-activedescendant={composer.activeOptionId}
        />
        {composer.isMenuOpen && (
          <MentionMenu
            listId={composer.listId}
            users={composer.suggestions}
            activeIndex={composer.activeIndex}
            onPick={composer.pick}
          />
        )}
      </div>
      <div className="ccomposer__actions">
        {hint && <p className="ccomposer__hint">{hint}</p>}
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            {DISCUSSION_COPY.CANCEL}
          </Button>
        )}
        <Button type="submit" isLoading={isPending} disabled={!composer.canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
