import { z } from 'zod';
import { MESSAGES, NAME_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/constants';
import { emailSchema } from './shared-fields';

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

export const registerFormSchema = registerSchema
  .extend({ confirmPassword: z.string().min(1, MESSAGES.CONFIRM_PASSWORD_REQUIRED) })
  .refine((values) => values.password === values.confirmPassword, {
    message: MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

export type RegisterPayload = z.infer<typeof registerSchema>;
