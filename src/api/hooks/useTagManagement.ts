import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { TAG_CATEGORIES_PAGE_SIZE } from '@/constants';
import { SILENT_ERROR_META } from '../query-meta';
import { QUERY_KEYS } from '../query-keys';
import {
  createManagedTag,
  createTagCategory,
  deleteManagedTag,
  deleteTagCategory,
  getManagedTags,
  getTagCategories,
  getTagCategory,
  moveManagedTag,
  renameManagedTag,
  updateTagCategory,
} from '../service/tagManagement.service';
import type { ManagedTagsParams } from '../type/tag-management/tags-list';

interface CategoryListFilters {
  search: string;
  unused: boolean;
}

export function useTagCategoriesInfiniteQuery(
  userId: string | undefined,
  { search, unused }: CategoryListFilters,
) {
  const params = {
    limit: TAG_CATEGORIES_PAGE_SIZE,
    search: search || undefined,
    unused: unused || undefined,
  };
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.TAG_CATEGORIES(userId ?? '', params),
    queryFn: ({ pageParam }) => getTagCategories({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: ({ page, limit, total }) => (page * limit < total ? page + 1 : undefined),
    enabled: Boolean(userId),
  });
}

export function useTagCategoryQuery(userId: string | undefined, categoryId: number | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.TAG_CATEGORY(userId ?? '', categoryId ?? 0),
    queryFn: () => getTagCategory(categoryId ?? 0),
    enabled: Boolean(userId) && categoryId !== undefined,
  });
}

export function useManagedTagsQuery(
  userId: string | undefined,
  categoryId: number | undefined,
  params: ManagedTagsParams,
) {
  return useQuery({
    queryKey: QUERY_KEYS.MANAGED_TAGS(userId ?? '', categoryId ?? 0, params),
    queryFn: () => getManagedTags(categoryId ?? 0, params),
    enabled: Boolean(userId) && categoryId !== undefined,
    placeholderData: keepPreviousData,
  });
}

// Every change can alter counts on the other side, and the public filter options read the same data.
function useInvalidateTagData() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TAG_CATEGORIES_LIST }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TAGS_LIST }),
    ]);
}

export function useCreateTagCategoryMutation() {
  const invalidate = useInvalidateTagData();
  return useMutation({
    mutationFn: createTagCategory,
    // A 409 (duplicate name) is shown inline on the name field by the form.
    meta: SILENT_ERROR_META,
    onSuccess: invalidate,
  });
}

export function useUpdateTagCategoryMutation() {
  const invalidate = useInvalidateTagData();
  return useMutation({
    mutationFn: ({
      categoryId,
      ...payload
    }: {
      categoryId: number;
      name: string;
      description: string;
    }) => updateTagCategory(categoryId, payload),
    meta: SILENT_ERROR_META,
    onSuccess: invalidate,
  });
}

export function useDeleteTagCategoryMutation() {
  const invalidate = useInvalidateTagData();
  return useMutation({
    mutationFn: deleteTagCategory,
    // A 409 means the category became used meanwhile; the modal explains it.
    meta: SILENT_ERROR_META,
    onSuccess: invalidate,
  });
}

export function useCreateManagedTagMutation() {
  const invalidate = useInvalidateTagData();
  return useMutation({
    mutationFn: ({ categoryId, name }: { categoryId: number; name: string }) =>
      createManagedTag(categoryId, { name }),
    meta: SILENT_ERROR_META,
    onSuccess: invalidate,
  });
}

export function useRenameManagedTagMutation() {
  const invalidate = useInvalidateTagData();
  return useMutation({
    mutationFn: ({ tagId, name }: { tagId: number; name: string }) =>
      renameManagedTag(tagId, { name }),
    meta: SILENT_ERROR_META,
    onSuccess: invalidate,
  });
}

export function useMoveManagedTagMutation() {
  const invalidate = useInvalidateTagData();
  return useMutation({
    mutationFn: ({ tagId, categoryId }: { tagId: number; categoryId: number }) =>
      moveManagedTag(tagId, { categoryId }),
    meta: SILENT_ERROR_META,
    onSuccess: invalidate,
  });
}

export function useDeleteManagedTagMutation() {
  const invalidate = useInvalidateTagData();
  return useMutation({
    mutationFn: deleteManagedTag,
    meta: SILENT_ERROR_META,
    onSuccess: invalidate,
  });
}
