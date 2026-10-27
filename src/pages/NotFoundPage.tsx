import { Button, StatusPage } from '@/components';
import { NOT_FOUND_COPY } from '@/constants';
import { useStatusPageActions } from '@/hooks/useStatusPageActions';

export function NotFoundPage() {
  const { goHome, goBack } = useStatusPageActions();

  return (
    <main>
      <StatusPage
        eyebrow={NOT_FOUND_COPY.EYEBROW}
        codeStart="4"
        codeEnd="4"
        icon="notFound"
        title={NOT_FOUND_COPY.TITLE}
        description={NOT_FOUND_COPY.DESCRIPTION}
      >
        <Button onClick={goHome}>{NOT_FOUND_COPY.GO_HOME}</Button>
        <Button variant="secondary" onClick={goBack}>
          {NOT_FOUND_COPY.GO_BACK}
        </Button>
      </StatusPage>
    </main>
  );
}
