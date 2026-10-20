import { IMPORT_COPY } from '@/constants';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { MOCK_TAG_CATEGORIES } from '../mock';
import { buildTagsText } from '../utils';

const FEEDBACK = {
  idle: '',
  copied: IMPORT_COPY.TAGS_COPIED,
  failed: IMPORT_COPY.TAGS_COPY_FAILED,
} as const;

export function useImportTagsPanel() {
  const { status, copy } = useCopyToClipboard();

  return {
    categories: MOCK_TAG_CATEGORIES,
    feedback: FEEDBACK[status],
    copyTags: () => copy(buildTagsText(MOCK_TAG_CATEGORIES)),
  };
}
