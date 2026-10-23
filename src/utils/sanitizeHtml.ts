import DOMPurify from 'dompurify';
import {
  IMAGE_PROTOCOLS,
  LINK_PROTOCOLS,
  LINK_REL,
  LINK_TARGET,
  RICH_TEXT_ALLOWED_ATTRS,
  RICH_TEXT_ALLOWED_TAGS,
} from '@/constants';

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [...RICH_TEXT_ALLOWED_TAGS],
  ALLOWED_ATTR: [...RICH_TEXT_ALLOWED_ATTRS],
  ALLOW_DATA_ATTR: false,
};

const isAllowedUrl = (value: string, protocols: readonly string[]) => {
  try {
    return protocols.includes(new URL(value, window.location.origin).protocol);
  } catch {
    return false;
  }
};

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    if (!isAllowedUrl(node.getAttribute('href') ?? '', LINK_PROTOCOLS)) {
      node.removeAttribute('href');
      return;
    }
    node.setAttribute('rel', LINK_REL);
    node.setAttribute('target', LINK_TARGET);
  }
  // data: and other schemes are never valid image sources (uploads are http(s) or relative).
  // The attribute is dropped rather than the node so DOMPurify's tree walk stays intact.
  if (node.tagName === 'IMG' && !isAllowedUrl(node.getAttribute('src') ?? '', IMAGE_PROTOCOLS)) {
    node.removeAttribute('src');
  }
});

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, PURIFY_CONFIG);
}
