import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { getClients } from '../service/clients.service';

export function useClientsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENTS(userId ?? ''),
    queryFn: getClients,
    enabled: Boolean(userId),
  });
}
