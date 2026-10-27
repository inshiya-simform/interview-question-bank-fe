import { LETTER_OR_NUMBER_REGEX } from '@/constants';

export const hasLetterOrNumber = (value: string) => LETTER_OR_NUMBER_REGEX.test(value.trim());

// Mirrors the API's client-name uniqueness: ignores case and extra whitespace.
export const normalizeName = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();
