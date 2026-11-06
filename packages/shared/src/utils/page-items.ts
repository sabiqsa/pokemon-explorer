export const ELLIPSIS = 'ellipsis';

export type PageItem = number | typeof ELLIPSIS;

const SHOW_ALL_MAX = 7;
const WINDOW_SIZE = 3;

export function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages < 1) return [];

  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (totalPages <= SHOW_ALL_MAX) return range(1, totalPages);

  const current = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  const windowStart = Math.min(Math.max(1, current - 1), totalPages - WINDOW_SIZE + 1);
  const shown = [...new Set([1, ...range(windowStart, windowStart + WINDOW_SIZE - 1), totalPages])].sort((a, b) => a - b);

  const items: PageItem[] = [];
  for (const [i, value] of shown.entries()) {
    const previous = shown[i - 1];
    if (previous !== undefined) {
      const gap = value - previous - 1;
      if (gap === 1) items.push(previous + 1);
      else if (gap > 1) items.push(ELLIPSIS);
    }
    items.push(value);
  }
  return items;
}
