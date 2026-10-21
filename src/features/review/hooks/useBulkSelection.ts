import { useState } from 'react';
import type { ReviewedQuestion } from '@/api';
import { REVIEW_STATUS } from '@/constants';

// Only questions awaiting a decision can be selected. Ids that left the current page or
// changed status are dropped on read, so the selection never outlives the visible list.
export function useBulkSelection(items: readonly ReviewedQuestion[]) {
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());

  const selectableIds = items
    .filter((item) => item.status === REVIEW_STATUS.PENDING_REVIEW)
    .map((item) => item.id);
  const selectedIds = selectableIds.filter((id) => picked.has(id));
  const isAllSelected = selectableIds.length > 0 && selectedIds.length === selectableIds.length;

  const toggle = (id: string) =>
    setPicked((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return {
    selectableIds,
    selectedIds,
    isAllSelected,
    isIndeterminate: selectedIds.length > 0 && !isAllSelected,
    isSelected: (id: string) => picked.has(id),
    toggle,
    toggleAll: () => setPicked(isAllSelected ? new Set() : new Set(selectableIds)),
    clear: () => setPicked(new Set()),
  };
}
