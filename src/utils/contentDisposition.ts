const FILENAME_PATTERN = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i;

export function parseContentDispositionFilename(header: unknown): string | null {
  if (typeof header !== 'string') return null;
  const match = FILENAME_PATTERN.exec(header);
  const raw = match?.[1]?.trim();
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
