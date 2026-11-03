import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { COMMENT_ANCHOR_PREFIX } from '@/constants';

interface UseCommentHashScrollArgs {
  // Re-runs the lookup whenever the rendered comments change.
  loadedCount: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

// Notification links end in "#comment-<id>". The comment may sit on a page that is not loaded
// yet, so pages are fetched one by one until it renders (or runs out).
export function useCommentHashScroll({
  loadedCount,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseCommentHashScrollArgs) {
  const { hash } = useLocation();
  const handledHash = useRef<string | null>(null);

  useEffect(() => {
    const isCommentHash = hash.startsWith(`#${COMMENT_ANCHOR_PREFIX}`);
    if (!isCommentHash || handledHash.current === hash || loadedCount === 0) return;
    const target = document.getElementById(hash.slice(1));
    if (target) {
      handledHash.current = hash;
      target.scrollIntoView({ block: 'center' });
      target.focus({ preventScroll: true });
    } else if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hash, loadedCount, hasNextPage, isFetchingNextPage, fetchNextPage]);
}
