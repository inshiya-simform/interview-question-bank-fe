import { useSession } from '@/features/auth';

export function useHomePage() {
  const { user, logout } = useSession();
  return { name: user?.name ?? '', logout };
}
