export const NUMERIC_ID_REGEX = /^\d+$/;
export const ISO_DAY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const LETTER_OR_NUMBER_REGEX = /[\p{L}\p{N}]/u;
export const WHITESPACE_REGEX = /\s/;
// An "@" at the start or after whitespace, with the partial handle typed up to the caret.
export const MENTION_TRIGGER_REGEX = /(^|\s)@([a-z0-9._-]*)$/i;
// The unfinished "@handle" right before the caret, replaced when a suggestion is picked.
export const MENTION_PARTIAL_REGEX = /@[a-z0-9._-]*$/i;
// A complete "@handle" inside a comment body; the capture group keeps it when splitting.
export const MENTION_TOKEN_REGEX = /(@[a-z0-9._-]*[a-z0-9])/i;
export const HANDLE_DISALLOWED_REGEX = /[^a-z0-9._-]/g;
