import { Alert, Button } from '@/components';
import { REVIEW_COPY } from '@/constants';
import { BANNER_ACTION } from '../banner';
import type { BannerAction, ReviewBanner } from '../banner';
import './ReviewLockBanner.css';

interface ReviewLockBannerProps {
  banner: ReviewBanner;
  isClaiming: boolean;
  onAction: (action: BannerAction) => void;
}

export function ReviewLockBanner({ banner, isClaiming, onAction }: ReviewLockBannerProps) {
  const { action } = banner;

  return (
    <Alert>
      <div className="rlock">
        <span className="rlock__message">
          <span aria-hidden="true">! </span>
          {banner.message}
        </span>
        {action && (
          <Button variant="secondary" isLoading={isClaiming} onClick={() => onAction(action)}>
            {action === BANNER_ACTION.RELOAD ? REVIEW_COPY.RELOAD : REVIEW_COPY.CLAIM}
          </Button>
        )}
      </div>
    </Alert>
  );
}
