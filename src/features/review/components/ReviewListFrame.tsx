import type { ReactNode } from 'react';
import { Alert, Button, Loader, Pagination } from '@/components';
import type { StatusTab } from '@/constants';
import { REVIEW_COPY } from '@/constants';
import { StatusTabs } from './StatusTabs';
import './ReviewListFrame.css';

interface ReviewListFrameProps {
  title: string;
  emptyText: string;
  tabs: readonly StatusTab[];
  activeTab: StatusTab;
  counts: Record<StatusTab, number>;
  onTabChange: (tab: StatusTab) => void;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  children: ReactNode;
}

// Shared shell for My submissions and the review queue.
export function ReviewListFrame({
  title,
  emptyText,
  tabs,
  activeTab,
  counts,
  onTabChange,
  total,
  page,
  totalPages,
  onPageChange,
  isLoading,
  isError,
  onRetry,
  children,
}: ReviewListFrameProps) {
  const hasData = !isLoading && !isError;

  return (
    <section className="rframe" aria-labelledby="rframe-title">
      <h1 id="rframe-title" className="rframe__title">
        {title}
      </h1>
      <StatusTabs tabs={tabs} active={activeTab} counts={counts} onChange={onTabChange} />
      <p className="rframe__count" aria-live="polite">
        {REVIEW_COPY.RESULT_COUNT(total)}
      </p>
      {isLoading && <Loader label={REVIEW_COPY.LOADING} />}
      {isError && !hasData && (
        <div className="rframe__error">
          <Alert>{REVIEW_COPY.LOAD_ERROR}</Alert>
          <Button variant="secondary" onClick={onRetry}>
            {REVIEW_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && (total === 0 ? <p className="rframe__empty">{emptyText}</p> : children)}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          label={REVIEW_COPY.PAGINATION_LABEL}
          previousLabel={REVIEW_COPY.PREVIOUS_PAGE}
          nextLabel={REVIEW_COPY.NEXT_PAGE}
          pageLabel={REVIEW_COPY.PAGE_NUMBER}
          statusLabel={REVIEW_COPY.PAGE_STATUS(page, totalPages)}
        />
      )}
    </section>
  );
}
