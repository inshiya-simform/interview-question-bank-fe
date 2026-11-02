import { describe, expect, it } from 'vitest';
import { ROLES } from '@/constants';
import { VOTE } from './constants';
import type { MentionUser } from './schema';
import {
  extractMentions,
  filterMentionUsers,
  getMentionQuery,
  insertMention,
  nextVote,
  splitMentions,
  toHandle,
} from './utils';

const priya: MentionUser = {
  id: 'u1',
  name: 'Priya Shah',
  handle: 'priya.shah',
  role: ROLES.REVIEWER,
};
const daniel: MentionUser = {
  id: 'u2',
  name: 'Daniel Okafor',
  handle: 'daniel.okafor',
  role: ROLES.USER,
};
const users = [priya, daniel];

describe('getMentionQuery', () => {
  it('returns the partial handle right after an @', () => {
    expect(getMentionQuery('hello @pri', 10)).toBe('pri');
    expect(getMentionQuery('@', 1)).toBe('');
  });

  it('ignores an @ inside a word such as an email address', () => {
    expect(getMentionQuery('mail me at a@b', 14)).toBeNull();
  });

  it('only looks at the text before the caret', () => {
    expect(getMentionQuery('hello @pri there', 6)).toBeNull();
    expect(getMentionQuery('hello @pri there', 10)).toBe('pri');
  });

  it('is null once the handle is followed by a space', () => {
    expect(getMentionQuery('hello @priya ', 13)).toBeNull();
  });
});

describe('filterMentionUsers', () => {
  it('matches on handle or name, case-insensitively', () => {
    expect(filterMentionUsers(users, 'OKA')).toEqual([daniel]);
    expect(filterMentionUsers(users, 'shah')).toEqual([priya]);
  });

  it('returns everyone for an empty query, capped at the limit', () => {
    expect(filterMentionUsers(users, '')).toEqual(users);
    expect(filterMentionUsers(users, '', 1)).toEqual([priya]);
  });
});

describe('insertMention', () => {
  it('replaces the partial handle and moves the caret past it', () => {
    expect(insertMention('hi @pri', 7, 'priya.shah')).toEqual({
      text: 'hi @priya.shah ',
      caret: 15,
    });
  });

  it('keeps text after the caret', () => {
    expect(insertMention('hi @pri thanks', 7, 'priya.shah')).toEqual({
      text: 'hi @priya.shah  thanks',
      caret: 15,
    });
  });
});

describe('extractMentions', () => {
  it('finds known handles and ignores unknown ones', () => {
    expect(extractMentions('@priya.shah and @nobody and @Daniel.Okafor.', users)).toEqual(users);
  });

  it('does not treat an email address as a mention', () => {
    expect(extractMentions('write to priya.shah@example.com', users)).toEqual([]);
  });
});

describe('splitMentions', () => {
  it('turns resolved handles into named mention parts', () => {
    expect(splitMentions('Thanks @priya.shah!', [priya])).toEqual([
      { key: 0, text: 'Thanks ', isMention: false },
      { key: 7, text: '@Priya Shah', isMention: true },
      { key: 18, text: '!', isMention: false },
    ]);
  });

  it('leaves handles the API did not resolve as plain text', () => {
    expect(splitMentions('hi @ghost', [])).toEqual([
      { key: 0, text: 'hi ', isMention: false },
      { key: 3, text: '@ghost', isMention: false },
    ]);
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

describe('toHandle', () => {
  it('uses the lowercased local part of the email', () => {
    expect(toHandle('Priya.Shah@simform.com')).toBe('priya.shah');
  });

  it('drops characters a handle cannot contain', () => {
    expect(toHandle('priya+tag@simform.com')).toBe('priyatag');
  });
});
