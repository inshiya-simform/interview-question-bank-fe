import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  clientAccessListParamsSchema,
  clientAccessListResponseSchema,
} from '../type/admin/client-access-list';
import type {
  ClientAccessListParams,
  ClientAccessListResponse,
} from '../type/admin/client-access-list';
import { createStaffSchema } from '../type/admin/create-staff';
import type { CreateStaffPayload } from '../type/admin/create-staff';
import { grantClientAccessSchema } from '../type/admin/grant-client-access';
import type { GrantClientAccessPayload } from '../type/admin/grant-client-access';
import { adminUserSchema, clientAccessSchema } from '../type/admin/shared';
import type { AdminUser, ClientAccess } from '../type/admin/shared';

export async function getClientAccessList(
  params: ClientAccessListParams,
): Promise<ClientAccessListResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.ADMIN.CLIENTS, {
    params: clientAccessListParamsSchema.parse(params),
  });
  return clientAccessListResponseSchema.parse(data);
}

export async function createStaff(payload: CreateStaffPayload): Promise<AdminUser> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.ADMIN.USERS,
    createStaffSchema.parse(payload),
  );
  return adminUserSchema.parse(data);
}

export async function grantClientAccess(
  clientId: string,
  payload: GrantClientAccessPayload,
): Promise<ClientAccess> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.ADMIN.CLIENT_USERS(clientId),
    grantClientAccessSchema.parse(payload),
  );
  return clientAccessSchema.parse(data);
}

export async function revokeClientAccess(clientId: string, userId: string): Promise<ClientAccess> {
  const { data } = await apiClient.delete(API_ENDPOINTS.ADMIN.CLIENT_USER(clientId, userId));
  return clientAccessSchema.parse(data);
}
