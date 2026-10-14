import { z } from 'zod';
import { roleSchema } from './shared';

export const userPermissionsSchema = z.object({
  role: roleSchema,
  permissions: z.array(z.string()),
  clientIds: z.array(z.string()),
});

export type UserPermissions = z.infer<typeof userPermissionsSchema>;
