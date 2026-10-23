import { z } from 'zod';
import { AUDIT_ACTIONS, AUDIT_MODULES } from '@/constants';

// Outbound query params: validated before sending; the API rejects unknown params.
export const auditLogListParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  module: z.enum(AUDIT_MODULES).optional(),
  action: z.enum(AUDIT_ACTIONS).optional(),
  actorId: z.uuid().optional(),
  search: z.string().optional(),
  from: z.iso.datetime({ offset: true }).optional(),
  to: z.iso.datetime({ offset: true }).optional(),
});

// action, module and role stay plain strings so a value the API adds later still renders.
export const auditLogSchema = z.object({
  id: z.string(),
  action: z.string(),
  module: z.string(),
  entityId: z.string().nullable(),
  actorId: z.string().nullable(),
  actorEmail: z.string(),
  actorName: z.string().nullable(),
  actorRole: z.string().nullable(),
  // Shape depends on the action; narrowed at render time.
  changes: z.unknown(),
  createdAt: z.string(),
});

export const auditLogListResponseSchema = z.object({
  logs: z.array(auditLogSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type AuditLogListParams = z.infer<typeof auditLogListParamsSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export type AuditLogListResponse = z.infer<typeof auditLogListResponseSchema>;
