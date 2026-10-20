import { useTagsQuery } from '@/api/hooks';
import { IMPORT_COPY } from '@/constants';
import { useSession } from '@/features/auth';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { buildTagsText } from '../utils';

const FEEDBACK = {
  idle: '',
  copied: IMPORT_COPY.TAGS_COPIED,
  failed: IMPORT_COPY.TAGS_COPY_FAILED,
} as const;

export function useImportTagsPanel() {
  const { user } = useSession();
  const { data } = useTagsQuery(user?.id);
  const { status, copy } = useCopyToClipboard();
  const categories = (data?.categories ?? []).map((category) => ({
    slug: category.slug,
    tags: category.tags.map((tag) => tag.slug),
  }));

  return {
    categories,
    feedback: FEEDBACK[status],
    copyTags: () => copy(buildTagsText(categories)),
  };
}
