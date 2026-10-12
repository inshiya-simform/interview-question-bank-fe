import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiError, getErrorMessage } from '@/api/errors';
import { HTTP_STATUS, QUERY_STALE_TIME_MS } from '@/constants';
import { toast } from 'react-toastify';

const NO_RETRY_STATUSES: readonly number[] = [
  HTTP_STATUS.UNAUTHORIZED,
  HTTP_STATUS.FORBIDDEN,
  HTTP_STATUS.NOT_FOUND,
];

// Every API error surfaces as a toast from here, so individual hooks never need to.
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: (error) => toast.error(getErrorMessage(error)) }),
  mutationCache: new MutationCache({
    onError: (error) => toast.error(getErrorMessage(error)),
  }),
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      retry: (failureCount, error) =>
        failureCount < 1 &&
        !(error instanceof ApiError && NO_RETRY_STATUSES.includes(error.status)),
    },
    mutations: { retry: false },
  },
});
