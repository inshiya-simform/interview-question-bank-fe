import { useCallback, useEffect, useRef } from 'react';

// Ref callback for an element at the end of a scroll area; fires onLoadMore when it becomes visible.
export function useLoadMoreSentinel(onLoadMore: () => void, enabled: boolean) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  return useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (!node || !enabled) return;
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMoreRef.current();
      });
      observerRef.current.observe(node);
    },
    [enabled],
  );
}
