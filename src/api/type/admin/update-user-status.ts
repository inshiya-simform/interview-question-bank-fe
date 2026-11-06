import { z } from 'zod';

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

export type UpdateUserStatusPayload = z.infer<typeof updateUserStatusSchema>;
