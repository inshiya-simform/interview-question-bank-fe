const HTML_TAG = /<\/?[a-z][^>]*>/i;

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

// Legacy notes are plain text; wrap them so line breaks survive as HTML.
export function normalizeAnswerHtml(value: string): string {
  if (value === '' || HTML_TAG.test(value)) return value;
  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll('\n', '<br>')}</p>`)
    .join('');
}

// An empty editor yields "<p></p>"; the API expects "" when there is no text and no image.
export function toPayloadHtml(html: string, text: string): string {
  return text.trim() === '' && !/<img\b/i.test(html) ? '' : html;
}
