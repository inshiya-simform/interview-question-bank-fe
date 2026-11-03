import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent, SyntheticEvent } from 'react';
import type { CommentPerson, MentionableUser } from '@/api';
import {
  COMMENT_COUNTER_THRESHOLD,
  COMMENT_MAX_LENGTH,
  DISCUSSION_COPY,
  MESSAGES,
} from '@/constants';
import { isDeepEqual } from '@/utils/isDeepEqual';
import { commentFormSchema } from '../schema';
import type { CommentInput, SubmitCallbacks } from '../schema';
import { extractMentionIds, getMentionQuery, insertMention, mentionOptionId } from '../utils';
import { useMentionSearch } from './useMentionSearch';

interface UseCommentComposerArgs {
  questionId: string;
  initialValue: string;
  // People already mentioned in `initialValue` (a reply's target, or an edited comment's mentions).
  initialMentions: readonly CommentPerson[];
  // Set when editing: submitting the same text and mentions is refused instead of sent.
  original?: CommentInput;
  autoFocus: boolean;
  isPending: boolean;
  onSubmit: (input: CommentInput, callbacks: SubmitCallbacks) => void;
}

const sortedIds = (ids: readonly string[]) => [...ids].sort();

export function useCommentComposer({
  questionId,
  initialValue,
  initialMentions,
  original,
  autoFocus,
  isPending,
  onSubmit,
}: UseCommentComposerArgs) {
  const [body, setBody] = useState(initialValue);
  const [caret, setCaret] = useState(initialValue.length);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [error, setError] = useState<string>();
  // Everyone picked from the menu; ids are the source of truth, names are only text.
  const [picked, setPicked] = useState<ReadonlyMap<string, CommentPerson>>(
    () => new Map(initialMentions.map((person) => [person.id, person])),
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const listId = useId();

  const query = getMentionQuery(body, caret);
  const isMenuOpen = query !== null && !isDismissed;
  const {
    users: suggestions,
    isSearching,
    hasResults,
  } = useMentionSearch(questionId, query, isMenuOpen);
  const safeIndex = Math.min(activeIndex, Math.max(suggestions.length - 1, 0));
  const hasOptions = isMenuOpen && suggestions.length > 0;
  const length = body.trim().length;
  const isOverLimit = length > COMMENT_MAX_LENGTH;

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

  const pick = (user: MentionableUser) => {
    const next = insertMention(body, caret, user.name);
    pendingCaret.current = next.caret;
    setPicked((current) => new Map(current).set(user.id, { id: user.id, name: user.name }));
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

  // Someone lost access: drop them from the mentions (their "@Name" stays as plain text) and let
  // the writer review and post again.
  const dropMentions = (ids: readonly string[]) => {
    const names = ids.flatMap((id) => picked.get(id)?.name ?? []);
    setPicked((current) => new Map([...current].filter(([id]) => !ids.includes(id))));
    setError(DISCUSSION_COPY.MENTION_ACCESS_LOST(names));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = commentFormSchema.safeParse({ body });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    const mentionIds = extractMentionIds(result.data.body, [...picked.values()]);
    const unchanged =
      original !== undefined &&
      isDeepEqual(
        { body: original.body, mentionIds: sortedIds(original.mentionIds) },
        { body: result.data.body, mentionIds: sortedIds(mentionIds) },
      );
    if (unchanged) {
      setError(MESSAGES.NOTHING_TO_EDIT);
      return;
    }
    onSubmit(
      { body: result.data.body, mentionIds },
      {
        onSuccess: () => {
          setBody('');
          setCaret(0);
          setPicked(new Map());
        },
        onLostMentions: dropMentions,
      },
    );
  };

  return {
    body,
    error,
    inputRef,
    listId,
    isMenuOpen,
    hasOptions,
    suggestions,
    isSearching,
    hasResults,
    activeIndex: safeIndex,
    activeOptionId: hasOptions ? mentionOptionId(listId, safeIndex) : undefined,
    canSubmit: length > 0 && !isOverLimit && !isPending,
    counter:
      body.length >= COMMENT_COUNTER_THRESHOLD
        ? {
            isOver: isOverLimit,
            label: isOverLimit
              ? DISCUSSION_COPY.COUNTER_OVER(length, COMMENT_MAX_LENGTH)
              : DISCUSSION_COPY.COUNTER(length, COMMENT_MAX_LENGTH),
          }
        : null,
    pick,
    onChange,
    onSelect,
    onKeyDown,
    submit,
  };
}
