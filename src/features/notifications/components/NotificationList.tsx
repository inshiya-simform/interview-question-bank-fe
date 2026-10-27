import { Alert, Button, Loader, PageHeader, Pagination } from '@/components';
import { NOTIFICATION_COPY, NOTIFICATION_FILTER } from '@/constants';
import { useNotificationList } from '../hooks/useNotificationList';
import { NotificationItem } from './NotificationItem';
import { NotificationTabs } from './NotificationTabs';
import './NotificationList.css';

export function NotificationList() {
  const list = useNotificationList();
  const hasData = !list.isLoading && !list.isError;

  return (
    <section className="nlist" aria-labelledby="nlist-title">
      <PageHeader
        title={NOTIFICATION_COPY.PAGE_TITLE}
        subtitle={NOTIFICATION_COPY.PAGE_SUBTITLE}
        titleId="nlist-title"
      >
        <Button variant="secondary" disabled={list.isMarkingAll} onClick={list.markAllRead}>
          {NOTIFICATION_COPY.MARK_ALL_READ}
        </Button>
      </PageHeader>
      <NotificationTabs
        active={list.filter}
        counts={{ all: list.counts.all, unread: list.counts.unread }}
        onChange={list.setFilter}
      />
      <p className="nlist__count" aria-live="polite">
        {hasData && NOTIFICATION_COPY.RESULT_COUNT(list.items.length, list.total)}
      </p>
      <div
        id="notification-tabpanel"
        role="tabpanel"
        aria-labelledby={`notification-tab-${list.filter}`}
        className="nlist__panel"
      >
        {list.isLoading && <Loader label={NOTIFICATION_COPY.LOADING} />}
        {list.isError && (
          <div className="nlist__error">
            <Alert>{NOTIFICATION_COPY.LOAD_ERROR}</Alert>
            <Button variant="secondary" onClick={list.refetch}>
              {NOTIFICATION_COPY.RETRY}
            </Button>
          </div>
        )}
        {hasData && list.total === 0 && (
          <p className="nlist__empty">
            {list.filter === NOTIFICATION_FILTER.UNREAD
              ? NOTIFICATION_COPY.EMPTY_UNREAD
              : NOTIFICATION_COPY.EMPTY_TITLE}
          </p>
        )}
        {hasData && list.total > 0 && (
          <ul className="nlist__items">
            {list.items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onOpen={list.openNotification}
                variant="full"
              />
            ))}
          </ul>
        )}
      </div>
      {list.totalPages > 1 && (
        <Pagination
          page={list.page}
          totalPages={list.totalPages}
          onPageChange={list.setPage}
          label={NOTIFICATION_COPY.PAGINATION_LABEL}
          previousLabel={NOTIFICATION_COPY.PREVIOUS_PAGE}
          nextLabel={NOTIFICATION_COPY.NEXT_PAGE}
          pageLabel={NOTIFICATION_COPY.PAGE_NUMBER}
          statusLabel={NOTIFICATION_COPY.PAGE_STATUS(list.page, list.totalPages)}
        />
      )}
    </section>
  );
}
