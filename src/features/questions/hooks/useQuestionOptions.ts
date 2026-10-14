import { useClientsQuery, useTagsQuery } from '@/api/hooks';
import { useSession } from '@/features/auth';

export function useQuestionOptions() {
  const { user } = useSession();
  const tagsQuery = useTagsQuery(user?.id);
  const clientsQuery = useClientsQuery(user?.id);

  const categories = tagsQuery.data?.categories ?? [];
  const clients = clientsQuery.data?.clients ?? [];

  const refetch = () => {
    if (tagsQuery.isError) void tagsQuery.refetch();
    if (clientsQuery.isError) void clientsQuery.refetch();
  };

  return {
    categories,
    clientOptions: clients.map(({ id, name }) => ({ value: id, label: name })),
    isLoading: tagsQuery.isPending || clientsQuery.isPending,
    isError: tagsQuery.isError || clientsQuery.isError,
    refetch,
  };
}
