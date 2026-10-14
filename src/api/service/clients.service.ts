import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { clientListResponseSchema } from '../type/clients/clients-list';
import type { ClientListResponse } from '../type/clients/clients-list';

export async function getClients(): Promise<ClientListResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.CLIENTS.BASE);
  return clientListResponseSchema.parse(data);
}
