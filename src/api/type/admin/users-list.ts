import { z } from 'zod';
import { adminUserSchema } from './shared';

// Outbound query params: validated before sending.
export const adminUsersParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
});

export const adminUsersResponseSchema = z.object({
  users: z.array(adminUserSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type AdminUsersParams = z.infer<typeof adminUsersParamsSchema>;
export type AdminUsersResponse = z.infer<typeof adminUsersResponseSchema>;
