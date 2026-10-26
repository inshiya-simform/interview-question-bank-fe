import { z } from 'zod';
import { MESSAGES, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/constants';

export const emailSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.EMAIL_REQUIRED)
  .pipe(z.email(MESSAGES.EMAIL_INVALID));

export const passwordFieldsSchema = z.object({
  password: z
    .string()
    .min(1, MESSAGES.PASSWORD_REQUIRED)
    .min(PASSWORD_MIN_LENGTH, MESSAGES.PASSWORD_TOO_SHORT)
    .max(PASSWORD_MAX_LENGTH, MESSAGES.PASSWORD_TOO_LONG),
  confirmPassword: z.string().min(1, MESSAGES.CONFIRM_PASSWORD_REQUIRED),
});

export const passwordsMatch = {
  check: (values: { password: string; confirmPassword: string }) =>
    values.password === values.confirmPassword,
  params: { message: MESSAGES.PASSWORDS_DO_NOT_MATCH, path: ['confirmPassword'] },
};
