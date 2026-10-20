import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE, MEMBER_LIST_ROLES, SEARCH_DEBOUNCE_MS } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { buildMemberSearchParams, parseMemberFilters } from '../memberFilters';

export function useMembersFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseMemberFilters(searchParams);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setSearchParams((prev) => {
      const current = parseMemberFilters(prev);
      if (current.search === debouncedSearch) return prev;
      return buildMemberSearchParams({ ...current, search: debouncedSearch, page: DEFAULT_PAGE });
    });
  }, [debouncedSearch, setSearchParams]);

  const setRole = (value: string) => {
    const role = MEMBER_LIST_ROLES.find((candidate) => candidate === value);
    setSearchParams((prev) =>
      buildMemberSearchParams({ ...parseMemberFilters(prev), role, page: DEFAULT_PAGE }),
    );
  };

  const setPage = (page: number) =>
    setSearchParams((prev) => buildMemberSearchParams({ ...parseMemberFilters(prev), page }));

  return { filters, searchInput, setSearchInput, setRole, setPage };
}
