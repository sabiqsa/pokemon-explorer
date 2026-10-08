// Pure functions: PokéAPI shapes in, domain types out.
import type { ApiNamedResource, ApiPokemon, ApiTypeList } from "@/features/pokemon/data/api/pokeapi";
import type { PokemonDetail, PokemonStat, PokemonSummary, StatName } from "@/features/pokemon/types";
import { ARTWORK_BASE_URL, NON_PLAYABLE_TYPES, STAT_NAMES } from "@/features/pokemon/config/constants";

/** "https://pokeapi.co/api/v2/pokemon/25/" -> "25" */
export function idFromResourceUrl(url: string): string {
  const id = url.match(/\/(\d+)\/?$/)?.[1];
  if (!id) throw new Error(`No ID in PokéAPI URL: ${url}`);
  return id;
}

/** Built from the ID so list cards never need a per-pokemon detail fetch. */
export function artworkUrl(id: string): string {
  return `${ARTWORK_BASE_URL}/${id}.png`;
}

export function toPokemonSummary(resource: ApiNamedResource): PokemonSummary {
  const id = idFromResourceUrl(resource.url);
  return { id, name: resource.name, imageUrl: artworkUrl(id), isCustom: false };
}

function isStatName(name: string): name is StatName {
  return (STAT_NAMES as readonly string[]).includes(name);
}

export function toPokemonDetail(api: ApiPokemon): PokemonDetail {
  const stats: PokemonStat[] = api.stats
    .filter((s) => isStatName(s.stat.name))
    .map((s) => ({ name: s.stat.name as StatName, value: s.base_stat }));

  return {
    id: String(api.id),
    name: api.name,
    imageUrl: api.sprites.other?.["official-artwork"]?.front_default ?? api.sprites.front_default,
    isCustom: false,
    types: [...api.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    abilities: [...api.abilities].sort((a, b) => a.slot - b.slot).map((a) => a.ability.name),
    stats,
  };
}

export function toTypeNames(list: ApiTypeList): string[] {
  return list.results.map((t) => t.name).filter((name) => !NON_PLAYABLE_TYPES.has(name));
}
