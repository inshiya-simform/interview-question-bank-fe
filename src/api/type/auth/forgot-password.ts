import { z } from 'zod';
import { emailSchema } from './shared-fields';

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const messageResponseSchema = z.object({ message: z.string() });

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
