import { z } from 'zod';
import { sessionUserSchema } from './shared';

export const currentUserSchema = sessionUserSchema.extend({
  permissions: z.array(z.string()),
  // Element shape is not documented yet; it is not rendered anywhere.
  clients: z.array(z.unknown()),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;
