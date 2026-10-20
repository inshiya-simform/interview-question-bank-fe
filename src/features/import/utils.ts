import type { ImportFailure, ImportRowError } from '@/api';
import {
  IMPORT_CLIENT_ERROR,
  IMPORT_COPY,
  IMPORT_LIMITS,
  IMPORT_PREVIEW_STATE,
  type ImportClientError,
  type ImportPreviewState,
} from '@/constants';
import { toCsvText } from '@/utils/csvText';

export interface SelectedFile {
  name: string;
  size: number;
}

export function findClientError(files: readonly SelectedFile[]): ImportClientError | null {
  const [file] = files;
  if (files.length > 1) return IMPORT_CLIENT_ERROR.MULTIPLE;
  if (!file) return null;
  if (!file.name.toLowerCase().endsWith(IMPORT_LIMITS.EXTENSION))
    return IMPORT_CLIENT_ERROR.NOT_CSV;
  if (file.size > IMPORT_LIMITS.MAX_FILE_BYTES) return IMPORT_CLIENT_ERROR.TOO_LARGE;
  return null;
}

export interface ErrorGroup {
  row: number;
  errors: ImportRowError[];
}

export function groupErrorsByRow(details: readonly ImportRowError[]): ErrorGroup[] {
  const groups = new Map<number, ImportRowError[]>();
  for (const error of details) {
    groups.set(error.row, [...(groups.get(error.row) ?? []), error]);
  }
  return [...groups].map(([row, errors]) => ({ row, errors })).sort((a, b) => a.row - b.row);
}

export const rowLabel = (row: number) => (row === 1 ? IMPORT_COPY.HEADER_ROW : String(row));

export const isValidationFailure = (
  failure: ImportFailure,
): failure is ImportFailure & {
  details: ImportRowError[];
} => (failure.details?.length ?? 0) > 0;

export function buildErrorListCsv(details: readonly ImportRowError[]): string {
  const { ROW, COLUMN, PROBLEM } = IMPORT_COPY.TABLE_HEADERS;
  return toCsvText([
    [ROW, COLUMN, PROBLEM],
    ...details.map((error) => [rowLabel(error.row), error.column ?? '', error.message]),
  ]);
}

export const buildTagsText = (categories: readonly { slug: string; tags: readonly string[] }[]) =>
  categories.map((category) => `${category.slug}: ${category.tags.join(', ')}`).join('\n');

export const parsePreviewState = (value: string): ImportPreviewState | undefined =>
  Object.values(IMPORT_PREVIEW_STATE).find((state) => state === value);
