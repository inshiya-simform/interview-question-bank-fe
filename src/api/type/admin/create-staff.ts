import { z } from 'zod';
import { MESSAGES, STAFF_ROLES } from '@/constants';
import { emailSchema } from '../auth/shared-fields';

// The API derives the display name from the email, so only email and role are collected.
export const createStaffSchema = z.object({
  email: emailSchema,
  role: z.enum(STAFF_ROLES, { error: MESSAGES.ROLE_REQUIRED }),
});

export type CreateStaffPayload = z.infer<typeof createStaffSchema>;
