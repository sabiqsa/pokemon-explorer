import { PAGE_SIZE, pagination, toSlug, type PaginationResult } from "@pokedex/shared";
import type { BerrySummary } from "@/features/berries/types";

export function normalizeBerryQuery(query: string): string {
  return toSlug(query).replace(/-?berry$/, "");
}

export function mergeBerries(custom: BerrySummary[], fromApi: BerrySummary[]): BerrySummary[] {
  return [...custom, ...fromApi];
}

export function searchBerries(
  all: BerrySummary[],
  { query = "", page = 1, pageSize = PAGE_SIZE }: { query?: string; page?: number; pageSize?: number },
): PaginationResult<BerrySummary> {
  const needle = normalizeBerryQuery(query);
  const matches = needle ? all.filter((b) => b.name.includes(needle)) : all;
  return pagination(matches, page, pageSize);
}
