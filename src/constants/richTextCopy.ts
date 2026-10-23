import { ANSWER_TEXT_MAX, IMAGE_MAX_BYTES } from './richText';

const IMAGE_MAX_MB = IMAGE_MAX_BYTES / (1024 * 1024);

export const RICH_TEXT_COPY = {
  TOOLBAR_LABEL: 'Text formatting',
  EDITOR_LABEL: 'Answer notes editor',
  BOLD: 'Bold',
  ITALIC: 'Italic',
  UNDERLINE: 'Underline',
  STRIKE: 'Strikethrough',
  HEADING: (level: number) => `Heading ${level}`,
  BULLET_LIST: 'Bulleted list',
  ORDERED_LIST: 'Numbered list',
  BLOCKQUOTE: 'Quote',
  CODE: 'Inline code',
  CODE_BLOCK: 'Code block',
  LINK: 'Link',
  UNLINK: 'Remove link',
  IMAGE: 'Image',
  RULE: 'Horizontal rule',
  UNDO: 'Undo',
  REDO: 'Redo',
  LINK_PROMPT: 'Link URL (http, https or mailto)',
  ALT_PROMPT: 'Image description (optional)',
  LINK_INVALID: 'Links must start with http://, https:// or mailto:',
  IMAGE_TYPE_INVALID: 'Only PNG, JPEG, WebP or GIF images are allowed.',
  IMAGE_TOO_LARGE: `Images must be ${IMAGE_MAX_MB} MB or smaller.`,
  IMAGE_UPLOADING: 'Uploading image',
  TEXT_COUNT: (count: number) =>
    `${count.toLocaleString()} / ${ANSWER_TEXT_MAX.toLocaleString()} characters`,
  TEXT_TOO_LONG: `Answer notes can have at most ${ANSWER_TEXT_MAX.toLocaleString()} characters of text`,
  HTML_TOO_LONG: 'Answer notes are too large. Remove some formatting or images.',
} as const;
