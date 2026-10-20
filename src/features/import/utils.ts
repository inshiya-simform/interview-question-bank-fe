import { ApiError } from '@/api/errors';
import { importValidationErrorBodySchema, type ImportRowError } from '@/api';
import {
  IMPORT_CLIENT_ERROR,
  IMPORT_COPY,
  IMPORT_LIMITS,
  type ImportClientError,
} from '@/constants';

export function findClientError(
  files: readonly Pick<File, 'name' | 'size'>[],
): ImportClientError | null {
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

// The API rejects a bad file with per-row details in the error body.
export function getValidationDetails(error: unknown): ImportRowError[] {
  if (!(error instanceof ApiError)) return [];
  const parsed = importValidationErrorBodySchema.safeParse(error.body);
  return parsed.success ? parsed.data.error.details : [];
}

export const buildTagsText = (categories: readonly { slug: string; tags: readonly string[] }[]) =>
  categories.map((category) => `${category.slug}: ${category.tags.join(', ')}`).join('\n');
