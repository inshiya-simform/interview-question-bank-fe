import { describe, expect, it } from 'vitest';
import { hasLetterOrNumber, normalizeName } from './validators';

describe('validators', () => {
  it('requires a letter or number', () => {
    expect(hasLetterOrNumber('???')).toBe(false);
    expect(hasLetterOrNumber('!!!')).toBe(false);
    expect(hasLetterOrNumber(' ?4? ')).toBe(true);
    expect(hasLetterOrNumber('¿Qué?')).toBe(true);
  });

  it('normalises names ignoring case and extra whitespace', () => {
    expect(normalizeName('  Acme   Corp ')).toBe(normalizeName('acme corp'));
  });
});
