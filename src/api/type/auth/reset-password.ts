import { z } from 'zod';
import { passwordFieldsSchema, passwordsMatch } from './shared-fields';

export const resetTokenSchema = z.string().min(1);

// The link is read from the URL, so the search params are validated like any other input.
export const resetPasswordSearchParamsSchema = z.object({ token: resetTokenSchema });

export const verifyResetTokenSchema = z.object({ token: resetTokenSchema });
export const verifyResetTokenResponseSchema = z.object({ valid: z.literal(true) });

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
