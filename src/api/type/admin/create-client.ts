import { z } from 'zod';
import { MESSAGES, NAME_MAX_LENGTH } from '@/constants';

export const createClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, MESSAGES.NAME_REQUIRED)
    .max(NAME_MAX_LENGTH, MESSAGES.NAME_TOO_LONG),
});

export type CreateClientPayload = z.infer<typeof createClientSchema>;
