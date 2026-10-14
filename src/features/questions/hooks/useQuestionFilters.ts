import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE, SEARCH_DEBOUNCE_MS } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { buildSearchParams, parseFilters } from '../filters';
import type { QuestionFilters } from '../filters';

export function useQuestionFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFilters(searchParams);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  // Reads the latest URL state so rapid consecutive updates never clobber each other.
  const update = (patch: Partial<QuestionFilters>) =>
    setSearchParams((prev) => buildSearchParams({ ...parseFilters(prev), ...patch }));

  // Any filter change goes back to the first page.
  const updateFilters = (patch: Partial<QuestionFilters>) =>
    update({ ...patch, page: DEFAULT_PAGE });

  useEffect(() => {
    setSearchParams((prev) => {
      const current = parseFilters(prev);
      if (current.search === debouncedSearch) return prev;
      return buildSearchParams({ ...current, search: debouncedSearch, page: DEFAULT_PAGE });
    });
  }, [debouncedSearch, setSearchParams]);

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  return {
    filters,
    searchInput,
    setSearchInput,
    setPage: (page: number) => update({ page }),
    updateFilters,
    clearFilters,
  };
}
