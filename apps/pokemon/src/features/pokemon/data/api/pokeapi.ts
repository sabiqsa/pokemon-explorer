// Raw PokéAPI calls. Responses are returned as-is; mapping happens in ../mappers.
import { cacheLife, cacheTag } from "next/cache";
import {
  ALL_POKEMON_LIMIT,
  POKEAPI_BASE_URL,
  POKEMON_LIST_TAG,
  POKEMON_TYPES_TAG,
} from "@/features/pokemon/config/constants";

export type ApiNamedResource = { name: string; url: string };

export type ApiPokemonList = {
  count: number;
  results: ApiNamedResource[];
};

export type ApiPokemon = {
  id: number;
  name: string;
  types: { slot: number; type: ApiNamedResource }[];
  abilities: { slot: number; is_hidden: boolean; ability: ApiNamedResource }[];
  stats: { base_stat: number; stat: ApiNamedResource }[];
  sprites: {
    front_default: string | null;
    other?: { "official-artwork"?: { front_default: string | null } };
  };
};

export type ApiTypeList = { results: ApiNamedResource[] };

async function getJson<T>(path: string): Promise<T | null> {
  const res = await fetch(`${POKEAPI_BASE_URL}${path}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`PokéAPI ${path} failed with ${res.status}`);
  return res.json() as Promise<T>;
}

/** Every pokemon name + URL. The roster rarely changes, so cache it for weeks. */
export async function fetchAllPokemon(): Promise<ApiPokemonList> {
  "use cache";
  cacheLife("weeks");
  cacheTag(POKEMON_LIST_TAG);

  const list = await getJson<ApiPokemonList>(`/pokemon?limit=${ALL_POKEMON_LIMIT}`);
  if (!list) throw new Error("PokéAPI pokemon list not found");
  return list;
}

/**
 * One pokemon by name, or null if PokéAPI doesn't know it.
 * Not cached here: the raw response is 300-700 KB (every move, game index, ...).
 * The service caches the mapped ~1 KB detail instead.
 */
export async function fetchPokemon(name: string): Promise<ApiPokemon | null> {
  return getJson<ApiPokemon>(`/pokemon/${encodeURIComponent(name)}`);
}

export async function fetchTypes(): Promise<ApiTypeList> {
  "use cache";
  cacheLife("max");
  cacheTag(POKEMON_TYPES_TAG);

  const types = await getJson<ApiTypeList>("/type");
  if (!types) throw new Error("PokéAPI type list not found");
  return types;
}
