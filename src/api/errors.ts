import { z } from 'zod';
import { HTTP_STATUS, MESSAGES } from '@/constants';

const messageSchema = z.union([z.string(), z.array(z.string())]);

// Error bodies are parsed leniently on purpose: we only extract a human message from them.
export const errorBodySchema = z.looseObject({
  message: messageSchema.optional(),
  error: z.union([z.string(), z.looseObject({ message: messageSchema.optional() })]).optional(),
});

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function joinMessage(value: z.infer<typeof messageSchema> | undefined) {
  return Array.isArray(value) ? value.join('. ') : value;
}

export function extractErrorMessage(status: number, body: unknown): string {
  const parsed = errorBodySchema.safeParse(body);
  if (parsed.success) {
    const { message, error } = parsed.data;
    const found =
      joinMessage(message) ?? (typeof error === 'string' ? error : joinMessage(error?.message));
    if (found) return found;
  }
  if (status === HTTP_STATUS.UNAUTHORIZED) return MESSAGES.ERROR_UNAUTHORIZED;
  if (status === HTTP_STATUS.FORBIDDEN) return MESSAGES.ERROR_FORBIDDEN;
  return MESSAGES.ERROR_UNKNOWN;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : MESSAGES.ERROR_UNKNOWN;
}
