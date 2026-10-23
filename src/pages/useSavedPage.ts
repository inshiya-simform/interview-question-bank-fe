import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE } from '@/constants';
import { buildSavedSearchParams, parseSavedFilters, useSavedState } from '@/features/saved';

export function useSavedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { collectionId, page } = parseSavedFilters(searchParams);
  const { collections, totalSaved } = useSavedState();

  const selectCollection = (id = '') =>
    setSearchParams(buildSavedSearchParams({ collectionId: id, page: DEFAULT_PAGE }));

  return {
    collections,
    selected: collections.find((collection) => collection.id === collectionId),
    collectionId: collectionId || undefined,
    page,
    totalCount: totalSaved,
    selectCollection,
    setPage: (next: number) =>
      setSearchParams(buildSavedSearchParams({ collectionId, page: next })),
  };
}
