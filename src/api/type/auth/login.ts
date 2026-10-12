import { z } from 'zod';
import { MESSAGES } from '@/constants';
import { emailSchema } from './shared-fields';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, MESSAGES.PASSWORD_REQUIRED),
});

export type LoginPayload = z.infer<typeof loginSchema>;
