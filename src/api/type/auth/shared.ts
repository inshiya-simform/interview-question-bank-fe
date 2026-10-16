import { z } from 'zod';
import { ROLES } from '@/constants';

export const roleSchema = z.enum([ROLES.SUPER_ADMIN, ROLES.USER, ROLES.AUTHOR, ROLES.REVIEWER]);

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: roleSchema,
});

export const authResponseSchema = z.object({
  user: sessionUserSchema,
  token: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
