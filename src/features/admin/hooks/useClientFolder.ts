import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useAdminUsersQuery,
  useGrantClientAccessMutation,
  useRevokeClientAccessMutation,
} from '@/api/hooks';
import { ADMIN_COPY, CLIENT_FOLDER_USERS_PAGE_SIZE, CLIENT_ID_PARAM, MESSAGES } from '@/constants';
import { useSession } from '@/features/auth';
import { useDisclosure } from '@/hooks/useDisclosure';
import { folderLocationStateSchema, toFolderUsersParams } from '../filters';
import { useClientAccessFilters } from './useClientAccessFilters';

export function useClientFolder() {
  const clientId = useParams()[CLIENT_ID_PARAM] ?? '';
  const location = useLocation();
  const { user } = useSession();
  const filterState = useClientAccessFilters();
  const addUser = useDisclosure();
  const grant = useGrantClientAccessMutation();
  const revoke = useRevokeClientAccessMutation();

  // Without a client id the query would list every user, so it stays disabled instead.
  const query = useAdminUsersQuery(
    clientId ? user?.id : undefined,
    toFolderUsersParams(filterState.filters, clientId),
  );

  const users = query.data?.users ?? [];
  const total = query.data?.total ?? 0;
  const rangeStart = (filterState.filters.page - 1) * CLIENT_FOLDER_USERS_PAGE_SIZE + 1;

  // The name arrives with the navigation; a direct visit falls back to the first user's client.
  const navigatedName = folderLocationStateSchema.safeParse(location.state).data?.clientName;
  const clientName =
    navigatedName ??
    users[0]?.clients.find((client) => client.id === clientId)?.name ??
    ADMIN_COPY.FOLDER_FALLBACK_TITLE;

  const onSuccess = () => toast.success(MESSAGES.CLIENT_ACCESS_UPDATED);

  const grantUser = (email: string) =>
    grant.mutate(
      { clientId, email },
      {
        onSuccess: () => {
          onSuccess();
          addUser.toggle();
        },
      },
    );

  const removeUser = (userId: string) => revoke.mutate({ clientId, userId }, { onSuccess });

  return {
    ...filterState,
    clientName,
    users,
    total,
    totalPages: Math.max(1, Math.ceil(total / CLIENT_FOLDER_USERS_PAGE_SIZE)),
    rangeStart,
    rangeEnd: rangeStart + users.length - 1,
    isLoading: query.isPending,
    isError: query.isError,
    hasData: query.data !== undefined,
    refetch: () => void query.refetch(),
    isAdding: addUser.isOpen,
    toggleAdd: addUser.toggle,
    isGranting: grant.isPending,
    isRevoking: revoke.isPending,
    grantUser,
    removeUser,
  };
}
