export const NUMERIC_ID_REGEX = /^\d+$/;
export const ISO_DAY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const LETTER_OR_NUMBER_REGEX = /[\p{L}\p{N}]/u;
export const WHITESPACE_REGEX = /\s/;
// An "@" at the start or after whitespace, with the text typed after it up to the caret.
export const MENTION_TRIGGER_REGEX = /(^|\s)@([\p{L}\p{N}._'-]*)$/u;
// The unfinished "@text" right before the caret, replaced when a suggestion is picked.
export const MENTION_PARTIAL_REGEX = /@[\p{L}\p{N}._'-]*$/u;
// Names are not unique and can contain spaces, so a mention is matched by its full "@Name"
// bounded by non-word characters; these fragments are combined with the escaped name.
export const MENTION_BOUNDARY_BEFORE = '(?<![\\p{L}\\p{N}])';
export const MENTION_BOUNDARY_AFTER = '(?![\\p{L}\\p{N}])';
