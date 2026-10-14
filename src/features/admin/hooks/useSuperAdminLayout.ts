import { useSession } from '@/features/auth';

export function useSuperAdminLayout() {
  const { user, logout } = useSession();
  return { name: user?.name ?? '', email: user?.email ?? '', logout };
}
