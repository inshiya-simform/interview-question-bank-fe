import { ROLE_LABELS } from '@/constants';
import { useSession } from '@/features/auth';

export function useSuperAdminLayout() {
  const { user, logout } = useSession();
  return {
    name: user?.name ?? '',
    roleLabel: user ? ROLE_LABELS[user.role] : '',
    email: user?.email ?? '',
    logout,
  };
}
