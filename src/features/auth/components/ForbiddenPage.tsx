import { Button, StatusPage } from '@/components';
import { FORBIDDEN_COPY, NOT_FOUND_COPY } from '@/constants';
import { useStatusPageActions } from '@/hooks/useStatusPageActions';

export function ForbiddenPage() {
  const { goHome, goBack } = useStatusPageActions();

  return (
    <StatusPage
      compact
      eyebrow={FORBIDDEN_COPY.EYEBROW}
      codeStart="4"
      codeEnd="3"
      icon="lock"
      title={FORBIDDEN_COPY.TITLE}
      description={FORBIDDEN_COPY.DESCRIPTION}
    >
      <Button onClick={goHome}>{NOT_FOUND_COPY.GO_HOME}</Button>
      <Button variant="secondary" onClick={goBack}>
        {NOT_FOUND_COPY.GO_BACK}
      </Button>
    </StatusPage>
  );
}
