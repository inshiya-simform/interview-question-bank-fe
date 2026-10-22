import { z } from 'zod';
import { MESSAGES, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/constants';

export const resetTokenSchema = z.string().min(1);

// The link is read from the URL, so the search params are validated like any other input.
export const resetPasswordSearchParamsSchema = z.object({ token: resetTokenSchema });

export const verifyResetTokenSchema = z.object({ token: resetTokenSchema });
export const verifyResetTokenResponseSchema = z.object({ valid: z.literal(true) });

const passwordFieldsSchema = z.object({
  password: z
    .string()
    .min(1, MESSAGES.PASSWORD_REQUIRED)
    .min(PASSWORD_MIN_LENGTH, MESSAGES.PASSWORD_TOO_SHORT)
    .max(PASSWORD_MAX_LENGTH, MESSAGES.PASSWORD_TOO_LONG),
  confirmPassword: z.string().min(1, MESSAGES.CONFIRM_PASSWORD_REQUIRED),
});

const passwordsMatch = {
  check: (values: { password: string; confirmPassword: string }) =>
    values.password === values.confirmPassword,
  params: { message: MESSAGES.PASSWORDS_DO_NOT_MATCH, path: ['confirmPassword'] },
};

export const resetPasswordFormSchema = passwordFieldsSchema.refine(
  passwordsMatch.check,
  passwordsMatch.params,
);

export const resetPasswordSchema = passwordFieldsSchema
  .extend({ token: resetTokenSchema })
  .refine(passwordsMatch.check, passwordsMatch.params);

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
export type VerifyResetTokenResponse = z.infer<typeof verifyResetTokenResponseSchema>;
