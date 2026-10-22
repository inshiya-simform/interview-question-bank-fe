import { ApiError } from './errors';
import { errorDetailsBodySchema } from './type/auth/error-details';

// Maps API validation `details` to the first message per top-level field.
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {};
  const parsed = errorDetailsBodySchema.safeParse(error.body);
  if (!parsed.success) return {};
  const fields: Record<string, string> = {};
  for (const { path, message } of parsed.data.error.details ?? []) {
    const field = String(path[0]);
    fields[field] ??= message;
  }
  return fields;
}
