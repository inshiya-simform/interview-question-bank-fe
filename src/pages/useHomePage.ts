import { useSession } from '@/features/auth';
import { useQuestionsHome } from '@/features/questions';

export function useHomePage() {
  const { user, logout } = useSession();
  return { name: user?.name ?? '', logout, ...useQuestionsHome() };
}
