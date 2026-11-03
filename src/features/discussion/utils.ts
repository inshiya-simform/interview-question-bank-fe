import type { Comment, CommentPerson } from '@/api';
import {
  COMMENT_MAX_MENTIONS,
  MENTION_BOUNDARY_AFTER,
  MENTION_BOUNDARY_BEFORE,
  MENTION_PARTIAL_REGEX,
  MENTION_TRIGGER_REGEX,
  VOTE,
} from '@/constants';
import type { VoteValue } from '@/constants';
import { escapeRegExp } from '@/utils/escapeRegExp';

export interface BodyPart {
  // Offset into the body: stable across renders, unlike an array index.
  key: number;
  text: string;
  isMention: boolean;
}

// The text typed right after an "@" before the caret, or null when no mention is in progress.
export function getMentionQuery(text: string, caret: number): string | null {
  const match = MENTION_TRIGGER_REGEX.exec(text.slice(0, caret));
  return match ? (match[2] ?? '') : null;
}

// Swaps the unfinished "@par" before the caret for the full "@Name" and returns the new caret.
export function insertMention(
  text: string,
  caret: number,
  name: string,
): { text: string; caret: number } {
  const before = text.slice(0, caret).replace(MENTION_PARTIAL_REGEX, () => `@${name} `);
  return { text: before + text.slice(caret), caret: before.length };
}

// Names are not unique, so the picked ids are the truth and the text only says which are kept.
function mentionPattern(names: readonly string[]): RegExp {
  const alternatives = [...new Set(names)]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|');
  return new RegExp(
    `${MENTION_BOUNDARY_BEFORE}(@(?:${alternatives}))${MENTION_BOUNDARY_AFTER}`,
    'gu',
  );
}

// Ids of picked people whose "@Name" is still in the body, capped at what the API accepts.
export function extractMentionIds(body: string, picked: readonly CommentPerson[]): string[] {
  if (picked.length === 0) return [];
  const present = new Set(
    body
      .split(mentionPattern(picked.map((person) => person.name)))
      .filter((_, index) => index % 2 === 1)
      .map((token) => token.slice(1)),
  );
  return picked
    .filter((person) => present.has(person.name))
    .map((person) => person.id)
    .slice(0, COMMENT_MAX_MENTIONS);
}

// Only names the API resolved to a mention are highlighted; other "@text" stays plain.
export function splitMentions(body: string, mentions: readonly CommentPerson[]): BodyPart[] {
  if (mentions.length === 0) return body === '' ? [] : [{ key: 0, text: body, isMention: false }];
  let offset = 0;
  return body
    .split(mentionPattern(mentions.map((person) => person.name)))
    .map((text, index) => ({ text, isMention: index % 2 === 1 }))
    .filter(({ text }) => text !== '')
    .map(({ text, isMention }) => {
      const part = { key: offset, text, isMention };
      offset += text.length;
      return part;
    });
}

// Clicking the active arrow again withdraws the vote.
export function nextVote(current: VoteValue, clicked: VoteValue): VoteValue {
  return current === clicked ? VOTE.NONE : clicked;
}

export const mentionOptionId = (listId: string, index: number): string =>
  `${listId}-option-${index}`;

// Earlier entries win, so loaded replies keep their place and a reply that is also in the
// preview (or was just posted) shows once.
export function dedupeById(comments: readonly Comment[]): Comment[] {
  const seen = new Set<string>();
  return comments.filter((comment) => !seen.has(comment.id) && seen.add(comment.id));
}

interface RemainingRepliesArgs {
  replyCount: number;
  shown: number;
  // The replies query has pages, and the last one had no cursor.
  allLoaded: boolean;
  hasNextPage: boolean;
}

// Replies the "View N more" button still promises.
export function countRemainingReplies({
  replyCount,
  shown,
  allLoaded,
  hasNextPage,
}: RemainingRepliesArgs): number {
  if (allLoaded) return 0;
  const unseen = Math.max(replyCount - shown, 0);
  // A cursor means more exist even if the counts drifted.
  return hasNextPage ? Math.max(unseen, 1) : unseen;
}
