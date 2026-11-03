import { describe, expect, it } from 'vitest';
import { getLostMentionIds } from './comment-errors';
import { ApiError } from './errors';

describe('getLostMentionIds', () => {
  it('reads the ids from a 400 with details.mentions', () => {
    const body = {
      error: { code: 'VALIDATION_ERROR', message: 'x', details: { mentions: ['a'] } },
    };
    expect(getLostMentionIds(new ApiError(400, 'x', body))).toEqual(['a']);
  });

  it('is empty for other 400s, other statuses and other errors', () => {
    const issues = { error: { details: [{ path: ['body'], message: 'bad' }] } };
    expect(getLostMentionIds(new ApiError(400, 'x', issues))).toEqual([]);
    expect(
      getLostMentionIds(new ApiError(404, 'x', { error: { details: { mentions: ['a'] } } })),
    ).toEqual([]);
    expect(getLostMentionIds(new Error('boom'))).toEqual([]);
  });
});
