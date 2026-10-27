import { useCheckDuplicateQuery } from '@/api/hooks';
import { DUPLICATE_CHECK_DEBOUNCE_MS, DUPLICATE_CHECK_MIN_LENGTH } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { useSession } from '@/features/auth';
import { hasLetterOrNumber } from '@/utils/validators';

interface DuplicateCheckInput {
  text: string;
  clientId: string;
  // The question being edited, so the API never matches it against itself.
  excludeId?: string;
  isActive: boolean;
}

// Duplicates are scoped per client, so a client change re-runs the check like a text change.
export function useDuplicateCheck({ text, clientId, excludeId, isActive }: DuplicateCheckInput) {
  const { user } = useSession();
  const debounced = useDebounce(text.trim(), DUPLICATE_CHECK_DEBOUNCE_MS);
  // Text the form rejects (e.g. "???") is never sent, so the API isn't asked about it.
  const enabled =
    isActive && debounced.length >= DUPLICATE_CHECK_MIN_LENGTH && hasLetterOrNumber(debounced);
  const query = useCheckDuplicateQuery(
    user?.id,
    { text: debounced, clientId: clientId || undefined, excludeId },
    enabled,
  );

  // keepPreviousData would otherwise leak stale matches after the text is cleared or shortened.
  const matches = enabled ? (query.data?.matches ?? []) : [];

  return { matches, isChecking: enabled && query.isFetching };
}
