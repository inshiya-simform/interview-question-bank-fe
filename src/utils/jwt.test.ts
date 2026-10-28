import { describe, expect, it } from 'vitest';
import { getJwtExpiryMs } from './jwt';

const encode = (value: unknown) =>
  btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const makeToken = (payload: unknown) => `${encode({ alg: 'HS256' })}.${encode(payload)}.sig`;

describe('getJwtExpiryMs', () => {
  it('returns exp in milliseconds', () => {
    expect(getJwtExpiryMs(makeToken({ exp: 1_700_000_000, sub: 'u1' }))).toBe(1_700_000_000_000);
  });

  it('returns null without a numeric exp', () => {
    expect(getJwtExpiryMs(makeToken({ exp: 'soon' }))).toBeNull();
    expect(getJwtExpiryMs(makeToken({}))).toBeNull();
  });

  it('returns null for malformed tokens', () => {
    expect(getJwtExpiryMs('not-a-jwt')).toBeNull();
    expect(getJwtExpiryMs('a.%%%.c')).toBeNull();
  });
});
