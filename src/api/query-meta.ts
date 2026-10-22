const SILENT_ERROR_KEY = 'silentError';

// Marks a query/mutation whose errors are rendered inline instead of toasted centrally.
export const SILENT_ERROR_META = { [SILENT_ERROR_KEY]: true } as const;

export function isSilentError(meta: Record<string, unknown> | undefined): boolean {
  return meta?.[SILENT_ERROR_KEY] === true;
}
