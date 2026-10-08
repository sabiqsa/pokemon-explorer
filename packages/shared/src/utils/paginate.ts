import type { Paginated } from "../types/pagination";

/**
 * Slice `items` into one page. `page` is 1-based and clamped into range,
 * so a stale `?page=99` after a narrower search still lands on a real page.
 */
export function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  const start = (current - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: current,
    pageSize,
    total,
    totalPages,
  };
}
