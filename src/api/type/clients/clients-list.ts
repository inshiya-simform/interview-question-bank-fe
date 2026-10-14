import { z } from 'zod';

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const clientListResponseSchema = z.object({
  clients: z.array(clientSchema),
});

export type Client = z.infer<typeof clientSchema>;
export type ClientListResponse = z.infer<typeof clientListResponseSchema>;
