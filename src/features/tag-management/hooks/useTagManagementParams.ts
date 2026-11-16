import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE } from '@/constants';
import { buildTagManagementSearchParams, parseTagManagementFilters } from '../filters';
import type { TagManagementFilters } from '../filters';

// Selection, searches and page live in the URL so the view is shareable and survives reloads.
export function useTagManagementParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseTagManagementFilters(searchParams);

  const update = (change: (current: TagManagementFilters) => TagManagementFilters) =>
    setSearchParams(
      (prev) => buildTagManagementSearchParams(change(parseTagManagementFilters(prev))),
      {
        replace: true,
      },
    );

  return {
    filters,
    selectCategory: (category: number | undefined) =>
      update((current) => ({ ...current, category, tagSearch: '', page: DEFAULT_PAGE })),
    setCategorySearch: (categorySearch: string) =>
      update((current) => ({ ...current, categorySearch })),
    setUnusedOnly: (unusedOnly: boolean) => update((current) => ({ ...current, unusedOnly })),
    setTagSearch: (tagSearch: string) =>
      update((current) => ({ ...current, tagSearch, page: DEFAULT_PAGE })),
    setPage: (page: number) => update((current) => ({ ...current, page })),
  };
}
