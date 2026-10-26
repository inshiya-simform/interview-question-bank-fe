import { useState } from 'react';
import type { DuplicateOverride } from '@/api';
import { DUPLICATE_OVERRIDE_PREVIEW_COUNT } from '../constants';

// `isCompact` (list rows) starts with the matches collapsed; the reason is always visible.
export function useDuplicateOverrideNotice(override: DuplicateOverride, isCompact: boolean) {
  const [isOpen, setIsOpen] = useState(!isCompact);
  const [showAll, setShowAll] = useState(false);
  const { matches } = override;
  const hiddenCount = Math.max(matches.length - DUPLICATE_OVERRIDE_PREVIEW_COUNT, 0);

  return {
    isOpen,
    showAll,
    count: matches.length,
    hiddenCount,
    visibleMatches: showAll ? matches : matches.slice(0, DUPLICATE_OVERRIDE_PREVIEW_COUNT),
    toggleOpen: () => setIsOpen((current) => !current),
    toggleShowAll: () => setShowAll((current) => !current),
  };
}
