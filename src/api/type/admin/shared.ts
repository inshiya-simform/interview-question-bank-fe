import { z } from 'zod';
import { clientSchema } from '../clients/clients-list';
import { roleSchema } from '../auth/shared';

export const adminUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: roleSchema,
  createdAt: z.string(),
  clients: z.array(clientSchema),
});

export type AdminUser = z.infer<typeof adminUserSchema>;
