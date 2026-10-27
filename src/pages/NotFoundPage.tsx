import { Button } from '@/components';
import { NOT_FOUND_COPY } from '@/constants';
import { useNotFoundPage } from './useNotFoundPage';
import './NotFoundPage.css';

export function NotFoundPage() {
  const { goHome, goBack } = useNotFoundPage();

  return (
    <main className="not-found">
      <p className="not-found__eyebrow">{NOT_FOUND_COPY.EYEBROW}</p>
      <div className="not-found__code" aria-hidden="true">
        <span>4</span>
        <span className="not-found__badge">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
            <path d="M9 9l4 4M13 9l-4 4" />
          </svg>
        </span>
        <span>4</span>
      </div>
      <h1 className="not-found__title">{NOT_FOUND_COPY.TITLE}</h1>
      <p className="not-found__description">{NOT_FOUND_COPY.DESCRIPTION}</p>
      <div className="not-found__actions">
        <Button onClick={goHome}>{NOT_FOUND_COPY.GO_HOME}</Button>
        <Button variant="secondary" onClick={goBack}>
          {NOT_FOUND_COPY.GO_BACK}
        </Button>
      </div>
    </main>
  );
}
