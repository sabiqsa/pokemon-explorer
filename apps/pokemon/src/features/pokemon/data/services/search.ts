import { PAGE_SIZE, pagination, toSlug, type PaginationResult } from "@pokedex/shared";
import type { PokemonSummary } from "@/features/pokemon/types";

export function mergePokemon(custom: PokemonSummary[], fromApi: PokemonSummary[]): PokemonSummary[] {
  return [...custom, ...fromApi];
}

export function searchPokemon(
  all: PokemonSummary[],
  { query = "", page = 1, pageSize = PAGE_SIZE }: { query?: string; page?: number; pageSize?: number },
): PaginationResult<PokemonSummary> {
  const needle = toSlug(query);
  const matches = needle ? all.filter((p) => p.name.includes(needle)) : all;
  return pagination(matches, page, pageSize);
}
