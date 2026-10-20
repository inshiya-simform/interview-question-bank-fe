import type { ImportFailure } from '@/api';
import { Button } from '@/components';
import { IMPORT_COPY } from '@/constants';
import './ImportStatus.css';

interface ImportFailureBannerProps {
  failure: ImportFailure;
  onRetry: () => void;
}

export function ImportFailureBanner({ failure, onRetry }: ImportFailureBannerProps) {
  return (
    <div className="istatus istatus--strong">
      <h2 className="istatus__title">
        <span aria-hidden="true">! </span>
        {IMPORT_COPY.FAILURE_TITLE}
      </h2>
      <p className="istatus__text">{failure.message || IMPORT_COPY.FAILURE_FALLBACK}</p>
      <div className="istatus__actions">
        <Button onClick={onRetry}>{IMPORT_COPY.RETRY}</Button>
      </div>
    </div>
  );
}
