import { z } from 'zod';
import { emailSchema } from '../auth/shared-fields';

export const grantClientAccessSchema = z.object({ email: emailSchema });

export type GrantClientAccessPayload = z.infer<typeof grantClientAccessSchema>;
