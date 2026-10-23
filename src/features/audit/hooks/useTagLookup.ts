import { useTagsQuery } from '@/api/hooks';
import { AUDIT_COPY } from '@/constants';
import { useSession } from '@/features/auth';
import type { TagLookup } from '../changes';

// Names are a nicety: while tags load, or for a deleted tag, the id is shown instead.
export function useTagLookup(): TagLookup {
  const { user } = useSession();
  const { data } = useTagsQuery(user?.id);
  const categories = data?.categories ?? [];

  return {
    tagName: (id) =>
      categories.flatMap((category) => category.tags).find((tag) => tag.id === id)?.name ??
      AUDIT_COPY.TAG_FALLBACK(id),
    categoryName: (id) =>
      categories.find((category) => category.id === id)?.name ?? AUDIT_COPY.CATEGORY_FALLBACK(id),
  };
}
