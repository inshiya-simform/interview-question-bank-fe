import { z } from 'zod';
import { MESSAGES, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, WHITESPACE_REGEX } from '@/constants';

export const emailSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.EMAIL_REQUIRED)
  .pipe(z.email(MESSAGES.EMAIL_INVALID));

// For a new password only; the current-password and login fields are never checked this way.
export const newPasswordSchema = z
  .string()
  .min(1, MESSAGES.PASSWORD_REQUIRED)
  .min(PASSWORD_MIN_LENGTH, MESSAGES.PASSWORD_TOO_SHORT)
  .max(PASSWORD_MAX_LENGTH, MESSAGES.PASSWORD_TOO_LONG)
  .refine((value) => !WHITESPACE_REGEX.test(value), MESSAGES.PASSWORD_HAS_WHITESPACE);

export const passwordFieldsSchema = z.object({
  password: newPasswordSchema,
  confirmPassword: z.string().min(1, MESSAGES.CONFIRM_PASSWORD_REQUIRED),
});

export const passwordsMatch = {
  check: (values: { password: string; confirmPassword: string }) =>
    values.password === values.confirmPassword,
  params: { message: MESSAGES.PASSWORDS_DO_NOT_MATCH, path: ['confirmPassword'] },
};
