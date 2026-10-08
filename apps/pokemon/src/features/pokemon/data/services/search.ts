// Pure search + pagination over already-loaded pokemon.
import { paginate, type Paginated } from "@pokedex/shared";
import type { PokemonSummary } from "@/features/pokemon/types";
import { PAGE_SIZE } from "@/features/pokemon/config/constants";
import { toSlug } from "@/features/pokemon/utils/helper";

/** Custom pokemon first so a newly added one is easy to find. */
export function mergePokemon(custom: PokemonSummary[], fromApi: PokemonSummary[]): PokemonSummary[] {
  return [...custom, ...fromApi];
}

export function searchPokemon(
  all: PokemonSummary[],
  { query = "", page = 1, pageSize = PAGE_SIZE }: { query?: string; page?: number; pageSize?: number },
): Paginated<PokemonSummary> {
  const needle = toSlug(query);
  const matches = needle ? all.filter((p) => p.name.includes(needle)) : all;
  return paginate(matches, page, pageSize);
}
