import {
  HANDLE_DISALLOWED_REGEX,
  MENTION_PARTIAL_REGEX,
  MENTION_TOKEN_REGEX,
  MENTION_TRIGGER_REGEX,
} from '@/constants';
import { MENTION_SUGGESTION_LIMIT, VOTE } from './constants';
import type { VoteValue } from './constants';
import type { MentionUser } from './schema';

export interface BodyPart {
  // Offset into the body: stable across renders, unlike an array index.
  key: number;
  text: string;
  isMention: boolean;
}

// Splitting on a capturing regex puts every "@handle" token at an odd index.
function tokenize(body: string): { text: string; isToken: boolean }[] {
  return body
    .split(MENTION_TOKEN_REGEX)
    .map((text, index) => ({ text, isToken: index % 2 === 1 }))
    .filter(({ text }) => text !== '');
}

// The partial handle being typed right before the caret, or null when no mention is in progress.
export function getMentionQuery(text: string, caret: number): string | null {
  const match = MENTION_TRIGGER_REGEX.exec(text.slice(0, caret));
  return match ? (match[2] ?? '').toLowerCase() : null;
}

export function filterMentionUsers(
  users: readonly MentionUser[],
  query: string,
  limit = MENTION_SUGGESTION_LIMIT,
): MentionUser[] {
  const needle = query.toLowerCase();
  return users
    .filter(
      (user) =>
        user.handle.toLowerCase().includes(needle) || user.name.toLowerCase().includes(needle),
    )
    .slice(0, limit);
}

// Swaps the unfinished "@par" before the caret for the full handle and returns the new caret.
export function insertMention(
  text: string,
  caret: number,
  handle: string,
): { text: string; caret: number } {
  const before = text.slice(0, caret).replace(MENTION_PARTIAL_REGEX, `@${handle} `);
  return { text: before + text.slice(caret), caret: before.length };
}

export function extractMentions(body: string, users: readonly MentionUser[]): MentionUser[] {
  const handles = new Set(
    tokenize(body)
      .filter(({ isToken }) => isToken)
      .map(({ text }) => text.slice(1).toLowerCase()),
  );
  return users.filter((user) => handles.has(user.handle.toLowerCase()));
}

// Only handles the API resolved to a person become mentions; anything else stays plain text.
export function splitMentions(body: string, mentions: readonly MentionUser[]): BodyPart[] {
  const byHandle = new Map(mentions.map((user) => [user.handle.toLowerCase(), user]));
  let offset = 0;
  return tokenize(body).map(({ text, isToken }) => {
    const user = isToken ? byHandle.get(text.slice(1).toLowerCase()) : undefined;
    const part = { key: offset, text: user ? `@${user.name}` : text, isMention: Boolean(user) };
    offset += text.length;
    return part;
  });
}

// Clicking the active arrow again withdraws the vote.
export function nextVote(current: VoteValue, clicked: VoteValue): VoteValue {
  return current === clicked ? VOTE.NONE : clicked;
}

export function toHandle(email: string): string {
  return (email.split('@')[0] ?? '').toLowerCase().replace(HANDLE_DISALLOWED_REGEX, '');
}

export const mentionOptionId = (listId: string, index: number): string =>
  `${listId}-option-${index}`;
