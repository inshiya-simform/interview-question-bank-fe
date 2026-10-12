import { z } from 'zod';
import { MESSAGES, NAME_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/constants';

const emailSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.EMAIL_REQUIRED)
  .pipe(z.email(MESSAGES.EMAIL_INVALID));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, MESSAGES.PASSWORD_REQUIRED),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, MESSAGES.NAME_REQUIRED)
    .max(NAME_MAX_LENGTH, MESSAGES.NAME_TOO_LONG),
  email: emailSchema,
  password: z
    .string()
    .min(1, MESSAGES.PASSWORD_REQUIRED)
    .min(PASSWORD_MIN_LENGTH, MESSAGES.PASSWORD_TOO_SHORT),
});

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
