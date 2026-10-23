import { normalizeAnswerHtml } from '@/utils/richText';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

// Stored HTML is never trusted: it is sanitised again before it reaches the DOM.
export function useSanitizedHtml(html: string) {
  return sanitizeHtml(normalizeAnswerHtml(html));
}
