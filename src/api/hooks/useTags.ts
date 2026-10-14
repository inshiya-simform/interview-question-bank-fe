import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { getTags } from '../service/tags.service';

export function useTagsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.TAGS(userId ?? ''),
    queryFn: getTags,
    enabled: Boolean(userId),
  });
}
