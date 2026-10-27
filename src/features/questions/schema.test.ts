import { describe, expect, it } from 'vitest';
import { MESSAGES, QUESTION_TEXT_MAX_LENGTH } from '@/constants';
import { questionTextSchema } from './schema';

const error = (value: string) => questionTextSchema.safeParse(value).error?.issues[0]?.message;

describe('questionTextSchema', () => {
  it('rejects punctuation-only text', () => {
    expect(error('???')).toBe(MESSAGES.QUESTION_TEXT_NO_ALPHANUMERIC);
    expect(error('!!!')).toBe(MESSAGES.QUESTION_TEXT_NO_ALPHANUMERIC);
  });

  it('keeps the required and max-length rules', () => {
    expect(error('   ')).toBe(MESSAGES.QUESTION_TEXT_REQUIRED);
    expect(error('a'.repeat(QUESTION_TEXT_MAX_LENGTH + 1))).toBe(MESSAGES.QUESTION_TEXT_TOO_LONG);
  });

  it('accepts text with letters or numbers', () => {
    expect(error('What is a closure?')).toBeUndefined();
    expect(error('?42?')).toBeUndefined();
  });
});
