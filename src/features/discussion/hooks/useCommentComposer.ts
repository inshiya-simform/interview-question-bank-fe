import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent, SyntheticEvent } from 'react';
import { commentFormSchema } from '../schema';
import type { CommentInput, MentionUser } from '../schema';
import {
  extractMentions,
  filterMentionUsers,
  getMentionQuery,
  insertMention,
  mentionOptionId,
} from '../utils';

interface UseCommentComposerArgs {
  users: readonly MentionUser[];
  initialValue: string;
  autoFocus: boolean;
  isPending: boolean;
  onSubmit: (input: CommentInput, onSuccess: () => void) => void;
}

export function useCommentComposer({
  users,
  initialValue,
  autoFocus,
  isPending,
  onSubmit,
}: UseCommentComposerArgs) {
  const [body, setBody] = useState(initialValue);
  const [caret, setCaret] = useState(initialValue.length);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const listId = useId();

  const query = getMentionQuery(body, caret);
  const suggestions = query === null ? [] : filterMentionUsers(users, query);
  const isMenuOpen = query !== null && !isDismissed;
  const safeIndex = Math.min(activeIndex, Math.max(suggestions.length - 1, 0));
  const hasOptions = isMenuOpen && suggestions.length > 0;

  useEffect(() => {
    const input = inputRef.current;
    if (!autoFocus || !input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, [autoFocus]);

  // The caret can only be moved once React has written the inserted mention into the textarea.
  useEffect(() => {
    const position = pendingCaret.current;
    if (position === null) return;
    pendingCaret.current = null;
    inputRef.current?.setSelectionRange(position, position);
  }, [body]);

  const pick = (user: MentionUser) => {
    const next = insertMention(body, caret, user.handle);
    pendingCaret.current = next.caret;
    setBody(next.text);
    setCaret(next.caret);
  };

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
    setCaret(event.target.selectionStart);
    setActiveIndex(0);
    setIsDismissed(false);
    setError(undefined);
  };

  const onSelect = (event: SyntheticEvent<HTMLTextAreaElement>) =>
    setCaret(event.currentTarget.selectionStart);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isMenuOpen) return;
    const active = suggestions[safeIndex];
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsDismissed(true);
    } else if (hasOptions && event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((safeIndex + 1) % suggestions.length);
    } else if (hasOptions && event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((safeIndex - 1 + suggestions.length) % suggestions.length);
    } else if (active && (event.key === 'Enter' || event.key === 'Tab')) {
      event.preventDefault();
      pick(active);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = commentFormSchema.safeParse({ body });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    const mentionIds = extractMentions(result.data.body, users).map((user) => user.id);
    onSubmit({ body: result.data.body, mentionIds }, () => {
      setBody('');
      setCaret(0);
    });
  };

  return {
    body,
    error,
    inputRef,
    listId,
    isMenuOpen,
    hasOptions,
    suggestions,
    activeIndex: safeIndex,
    activeOptionId: hasOptions ? mentionOptionId(listId, safeIndex) : undefined,
    canSubmit: body.trim() !== '' && !isPending,
    pick,
    onChange,
    onSelect,
    onKeyDown,
    submit,
  };
}
