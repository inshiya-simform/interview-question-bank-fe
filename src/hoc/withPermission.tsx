import type { ComponentType } from 'react';
import type { Permission } from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';

// Cosmetic gating only: renders nothing unless the user holds at least one required permission.
export function withPermission<P extends object>(
  Wrapped: ComponentType<P>,
  required: readonly Permission[],
) {
  function WithPermission(props: P) {
    const { hasAnyPermission } = usePermissions();
    return hasAnyPermission(required) ? <Wrapped {...props} /> : null;
  }
  WithPermission.displayName = `withPermission(${Wrapped.displayName ?? Wrapped.name})`;
  return WithPermission;
}
