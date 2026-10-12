import { Button } from '@/components';
import { HOME_COPY } from '@/constants';
import { useHomePage } from './useHomePage';
import './HomePage.css';

export function HomePage() {
  const { name, logout } = useHomePage();

  return (
    <main className="home">
      <h1>{HOME_COPY.WELCOME(name)}</h1>
      <p className="home__subtitle">{HOME_COPY.SUBTITLE}</p>
      <Button variant="secondary" onClick={logout}>
        {HOME_COPY.LOGOUT}
      </Button>
    </main>
  );
}
