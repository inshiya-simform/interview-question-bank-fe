import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AUDIT_ACTIONS, AUDIT_MODULES, DEFAULT_PAGE, SEARCH_DEBOUNCE_MS } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import type { AuditFilters } from '../filters';
import { buildAuditSearchParams, hasActiveAuditFilters, parseAuditFilters } from '../filters';

export function useAuditLogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseAuditFilters(searchParams);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setSearchParams((prev) => {
      const current = parseAuditFilters(prev);
      if (current.search === debouncedSearch) return prev;
      return buildAuditSearchParams({ ...current, search: debouncedSearch, page: DEFAULT_PAGE });
    });
  }, [debouncedSearch, setSearchParams]);

  // Every filter change returns to the first page.
  const update = (patch: Partial<AuditFilters>) =>
    setSearchParams((prev) =>
      buildAuditSearchParams({ ...parseAuditFilters(prev), ...patch, page: DEFAULT_PAGE }),
    );

  const setModule = (value: string) =>
    update({ module: AUDIT_MODULES.find((candidate) => candidate === value) });
  const setAction = (value: string) =>
    update({ action: AUDIT_ACTIONS.find((candidate) => candidate === value) });
  const setFrom = (value: string) => update({ from: value || undefined });
  const setTo = (value: string) => update({ to: value || undefined });

  const setPage = (page: number) =>
    setSearchParams((prev) => buildAuditSearchParams({ ...parseAuditFilters(prev), page }));

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  return {
    filters,
    searchInput,
    setSearchInput,
    setModule,
    setAction,
    setFrom,
    setTo,
    setPage,
    clearFilters,
    hasActiveFilters: hasActiveAuditFilters(filters) || searchInput !== '',
  };
}
