// Text content of an HTML string without executing or attaching it to the page.
export function htmlToText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // Block boundaries become line breaks so words from adjacent blocks don't fuse.
  for (const node of doc.body.querySelectorAll('br, p, li, h1, h2, h3, h4, blockquote, pre, tr')) {
    node.append('\n');
  }
  return (doc.body.textContent ?? '').replace(/\n{3,}/g, '\n\n').trim();
}

// Tags stripped, nothing added: matches how the API counts visible characters.
export function htmlTextLength(html: string): number {
  return (new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '').length;
}
