import { describe, expect, it } from 'vitest';
import { COMMENT_MAX_MENTIONS, VOTE } from '@/constants';
import {
  countRemainingReplies,
  dedupeById,
  extractMentionIds,
  getMentionQuery,
  insertMention,
  nextVote,
  splitMentions,
} from './utils';

const priya = { id: 'u1', name: 'Priya Shah' };
const daniel = { id: 'u2', name: 'Daniel Okafor' };
const twinPriya = { id: 'u3', name: 'Priya Shah' };

describe('getMentionQuery', () => {
  it('returns the text typed right after an @', () => {
    expect(getMentionQuery('hello @pri', 10)).toBe('pri');
    expect(getMentionQuery('@', 1)).toBe('');
    expect(getMentionQuery('hi @Tomás', 9)).toBe('Tomás');
  });

  it('ignores an @ inside a word such as an email address', () => {
    expect(getMentionQuery('mail me at a@b', 14)).toBeNull();
  });

  it('only looks at the text before the caret', () => {
    expect(getMentionQuery('hello @pri there', 6)).toBeNull();
    expect(getMentionQuery('hello @pri there', 10)).toBe('pri');
  });

  it('is null once the typed text is followed by a space', () => {
    expect(getMentionQuery('hello @priya ', 13)).toBeNull();
  });
});

describe('insertMention', () => {
  it('replaces the partial text with the full name and moves the caret past it', () => {
    expect(insertMention('hi @pri', 7, 'Priya Shah')).toEqual({
      text: 'hi @Priya Shah ',
      caret: 15,
    });
  });

  it('keeps text after the caret', () => {
    expect(insertMention('hi @pri thanks', 7, 'Priya Shah')).toEqual({
      text: 'hi @Priya Shah  thanks',
      caret: 15,
    });
  });

  it('does not read "$" in a name as a replacement pattern', () => {
    expect(insertMention('@x', 2, 'A$&B').text).toBe('@A$&B ');
  });
});

describe('extractMentionIds', () => {
  it('keeps picked people whose @Name is still in the text', () => {
    expect(extractMentionIds('@Priya Shah and @Daniel Okafor.', [priya, daniel])).toEqual([
      'u1',
      'u2',
    ]);
    expect(extractMentionIds('thanks @Daniel Okafor', [priya, daniel])).toEqual(['u2']);
  });

  it('drops a person once their @Name was edited away', () => {
    expect(extractMentionIds('@Priya Sha', [priya])).toEqual([]);
    expect(extractMentionIds('@Priya Shahid', [priya])).toEqual([]);
  });

  it('does not treat an email address as a mention', () => {
    expect(extractMentionIds('write to a@Priya Shah', [priya])).toEqual([]);
  });

  it('keeps every picked id when two people share a name', () => {
    expect(extractMentionIds('@Priya Shah', [priya, twinPriya])).toEqual(['u1', 'u3']);
  });

  it('never sends more mentions than the API accepts', () => {
    const many = Array.from({ length: COMMENT_MAX_MENTIONS + 3 }, (_, i) => ({
      id: `id-${i}`,
      name: `Person${String.fromCharCode(65 + i)}`,
    }));
    const body = many.map((person) => `@${person.name}`).join(' ');
    expect(extractMentionIds(body, many)).toHaveLength(COMMENT_MAX_MENTIONS);
  });
});

describe('splitMentions', () => {
  it('turns mentioned names into mention parts', () => {
    expect(splitMentions('Thanks @Priya Shah!', [priya])).toEqual([
      { key: 0, text: 'Thanks ', isMention: false },
      { key: 7, text: '@Priya Shah', isMention: true },
      { key: 18, text: '!', isMention: false },
    ]);
  });

  it('prefers the longest name when one is a prefix of another', () => {
    const short = { id: 'u4', name: 'Priya' };
    expect(splitMentions('@Priya Shah', [short, priya])).toEqual([
      { key: 0, text: '@Priya Shah', isMention: true },
    ]);
  });

  it('leaves @text the API did not resolve as plain text', () => {
    expect(splitMentions('hi @ghost', [])).toEqual([
      { key: 0, text: 'hi @ghost', isMention: false },
    ]);
    expect(splitMentions('hi @ghost', [priya])).toEqual([
      { key: 0, text: 'hi @ghost', isMention: false },
    ]);
  });

  it('escapes regex characters in names', () => {
    const odd = { id: 'u5', name: 'A.B (QA)' };
    expect(splitMentions('hey @A.B (QA)', [odd])).toEqual([
      { key: 0, text: 'hey ', isMention: false },
      { key: 4, text: '@A.B (QA)', isMention: true },
    ]);
  });

  it('returns nothing for an empty body', () => {
    expect(splitMentions('', [])).toEqual([]);
  });
});

describe('nextVote', () => {
  it('switches to the clicked vote', () => {
    expect(nextVote(VOTE.NONE, VOTE.UP)).toBe(VOTE.UP);
    expect(nextVote(VOTE.UP, VOTE.DOWN)).toBe(VOTE.DOWN);
  });

  it('withdraws the vote when the same arrow is clicked again', () => {
    expect(nextVote(VOTE.UP, VOTE.UP)).toBe(VOTE.NONE);
    expect(nextVote(VOTE.DOWN, VOTE.DOWN)).toBe(VOTE.NONE);
  });
});

describe('dedupeById', () => {
  it('keeps the first occurrence and the order', () => {
    const make = (id: string, score: number) => ({ id, score }) as never;
    const result = dedupeById([make('a', 1), make('b', 1), make('a', 2), make('c', 1)]);
    expect(result).toEqual([make('a', 1), make('b', 1), make('c', 1)]);
  });
});

describe('countRemainingReplies', () => {
  it('is the reply count minus what is shown', () => {
    const base = { allLoaded: false, hasNextPage: false };
    expect(countRemainingReplies({ ...base, replyCount: 8, shown: 3 })).toBe(5);
    expect(countRemainingReplies({ ...base, replyCount: 3, shown: 3 })).toBe(0);
    expect(countRemainingReplies({ ...base, replyCount: 2, shown: 3 })).toBe(0);
  });

  it('keeps the button while a cursor remains, even if the counts say otherwise', () => {
    expect(
      countRemainingReplies({ replyCount: 5, shown: 5, allLoaded: false, hasNextPage: true }),
    ).toBe(1);
  });

  it('is zero once every page is loaded', () => {
    expect(
      countRemainingReplies({ replyCount: 9, shown: 6, allLoaded: true, hasNextPage: false }),
    ).toBe(0);
  });
});
