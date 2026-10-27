import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

export function useStatusPageActions() {
  const navigate = useNavigate();

  const goHome = () => navigate(ROUTES.HOME);
  const goBack = () => navigate(-1);

  return { goHome, goBack };
}
