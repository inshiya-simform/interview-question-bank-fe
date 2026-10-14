import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE, SEARCH_DEBOUNCE_MS } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { buildSearchParams, parseFilters } from '../filters';

export function useClientAccessFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFilters(searchParams);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setSearchParams((prev) => {
      const current = parseFilters(prev);
      if (current.search === debouncedSearch) return prev;
      return buildSearchParams({ search: debouncedSearch, page: DEFAULT_PAGE });
    });
  }, [debouncedSearch, setSearchParams]);

  const setPage = (page: number) =>
    setSearchParams((prev) => buildSearchParams({ ...parseFilters(prev), page }));

  return { filters, searchInput, setSearchInput, setPage };
}
