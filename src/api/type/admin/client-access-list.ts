import { z } from 'zod';
import { clientSchema } from '../clients/clients-list';

// Outbound query params: validated before sending.
export const clientAccessListParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
});

export const clientAccessListResponseSchema = z.object({
  clients: z.array(clientSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type ClientAccessListParams = z.infer<typeof clientAccessListParamsSchema>;
export type ClientAccessListResponse = z.infer<typeof clientAccessListResponseSchema>;
