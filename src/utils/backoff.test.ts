import { describe, expect, it } from 'vitest';
import { backoffDelay } from './backoff';

const options = { initialMs: 1_000, maxMs: 30_000, factor: 2 };

describe('backoffDelay', () => {
  it('grows exponentially from the initial delay', () => {
    expect([0, 1, 2, 3].map((n) => backoffDelay(n, options))).toEqual([1_000, 2_000, 4_000, 8_000]);
  });

  it('caps at the maximum', () => {
    expect(backoffDelay(10, options)).toBe(30_000);
  });
});
