import { COMMON_COPY } from '@/constants';
import { Button } from './Button';
import { useErrorFallback } from './useErrorFallback';
import './ErrorFallback.css';

export function ErrorFallback() {
  const { reload } = useErrorFallback();

  return (
    <main className="error-fallback" role="alert">
      <h1 className="error-fallback__title">{COMMON_COPY.ERROR_TITLE}</h1>
      <p className="error-fallback__description">{COMMON_COPY.ERROR_DESCRIPTION}</p>
      <Button onClick={reload}>{COMMON_COPY.ERROR_RELOAD}</Button>
    </main>
  );
}
