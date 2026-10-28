import { z } from 'zod';
import { MESSAGES } from '@/constants';
import { passwordFieldsSchema, passwordsMatch } from './shared-fields';

// The form values are exactly the request body, so one schema validates both.
export const changePasswordSchema = passwordFieldsSchema
  .extend({ currentPassword: z.string().min(1, MESSAGES.CURRENT_PASSWORD_REQUIRED) })
  .refine(passwordsMatch.check, passwordsMatch.params);

export const changePasswordResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  message: z.string(),
});

export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>;
export type ChangePasswordResponse = z.infer<typeof changePasswordResponseSchema>;
