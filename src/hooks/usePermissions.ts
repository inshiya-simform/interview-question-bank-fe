import { useUserPermissionsQuery } from '@/api/hooks';
import { getAuthToken } from '@/api';
import type { Permission } from '@/constants';

export function usePermissions() {
  const { data, isPending } = useUserPermissionsQuery(getAuthToken() !== null);
  const permissions = data?.permissions ?? [];

  return {
    permissions,
    isLoading: isPending && getAuthToken() !== null,
    hasAnyPermission: (required: readonly Permission[]) =>
      required.some((permission) => permissions.includes(permission)),
  };
}
