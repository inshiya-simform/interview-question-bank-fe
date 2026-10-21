// The lock lasts 5 minutes server-side; the heartbeat must land well inside that window.
export const REVIEW_POLL_INTERVAL_MS = 15_000;
// Keeps decided and locked questions fresh on the queue without a manual refresh.
export const REVIEW_QUEUE_REFETCH_MS = 30_000;
