import { useCheckDuplicateQuery } from '@/api/hooks';
import { DUPLICATE_CHECK_DEBOUNCE_MS, DUPLICATE_CHECK_MIN_LENGTH } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { useSession } from '@/features/auth';

export function useDuplicateCheck(text: string, isActive: boolean) {
  const { user } = useSession();
  const debounced = useDebounce(text.trim(), DUPLICATE_CHECK_DEBOUNCE_MS);
  const enabled = isActive && debounced.length >= DUPLICATE_CHECK_MIN_LENGTH;
  const query = useCheckDuplicateQuery(user?.id, debounced, enabled);

  // keepPreviousData would otherwise leak stale matches after the text is cleared or shortened.
  const matches = enabled ? (query.data?.matches ?? []) : [];

  return { matches, isChecking: enabled && query.isFetching };
}
