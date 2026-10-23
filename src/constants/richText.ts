// Mirrors the API's sanitiser allow-list so what the editor shows is what gets saved.
export const RICH_TEXT_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'blockquote',
  'code',
  'pre',
  'a',
  'img',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
] as const;

export const RICH_TEXT_ALLOWED_ATTRS = ['href', 'src', 'alt', 'width', 'height'] as const;

export const LINK_PROTOCOLS = ['http:', 'https:', 'mailto:'] as const;
export const IMAGE_PROTOCOLS = ['http:', 'https:'] as const;
export const LINK_REL = 'noopener noreferrer nofollow';
export const LINK_TARGET = '_blank';

export const HEADING_LEVELS = [1, 2, 3, 4] as const;

export const ANSWER_HTML_MAX = 50_000;
export const ANSWER_TEXT_MAX = 10_000;

export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const;
export const IMAGE_ACCEPT = IMAGE_MIME_TYPES.join(',');
export const IMAGE_UPLOAD_FIELD = 'file';
