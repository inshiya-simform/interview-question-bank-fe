export type PageItem = { type: 'page'; page: number } | { type: 'gap'; key: 'start' | 'end' };

const MAX_SLOTS = 8;

const range = (from: number, to: number): PageItem[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({ type: 'page', page: from + i }));

// Always renders MAX_SLOTS items once there are more pages than slots, so the control keeps a
// constant width however many pages exist: `1 2 3 4 … N-1 N`, `1 … c-1 c c+1 … N-1 N`, `1 2 … N-3 N`.
export function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= MAX_SLOTS) return range(1, totalPages);

  if (page <= 3) {
    return [...range(1, 4), { type: 'gap', key: 'end' }, ...range(totalPages - 1, totalPages)];
  }
  if (page >= totalPages - 2) {
    return [...range(1, 2), { type: 'gap', key: 'start' }, ...range(totalPages - 3, totalPages)];
  }
  return [
    ...range(1, 1),
    { type: 'gap', key: 'start' },
    ...range(page - 1, page + 1),
    { type: 'gap', key: 'end' },
    ...range(totalPages - 1, totalPages),
  ];
}
