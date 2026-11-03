import { useMentionableUsersQuery } from '@/api/hooks';
import { MENTION_SEARCH_DEBOUNCE_MS } from '@/constants';
import { useSession } from '@/features/auth';
import { useDebounce } from '@/hooks/useDebounce';

// `query` is the text typed after "@" (null when no mention is in progress). The API only returns
// people with access to the question, so there is no other source of suggestions.
export function useMentionSearch(questionId: string, query: string | null, isOpen: boolean) {
  const { user } = useSession();
  const debounced = useDebounce(query ?? '', MENTION_SEARCH_DEBOUNCE_MS);
  // A bare "@" lists people straight away; only further typing is debounced.
  const term = query === '' ? '' : debounced;
  const search = useMentionableUsersQuery(user?.id, questionId, term.trim(), isOpen);

  return {
    users: search.data?.items ?? [],
    isSearching: search.isFetching,
    hasResults: search.data !== undefined,
  };
}
