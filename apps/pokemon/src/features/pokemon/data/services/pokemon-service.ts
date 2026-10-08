// Combines PokéAPI data with custom pokemon. Pages and actions call these, never the API or repository directly.
import "server-only";
import type { Paginated } from "@pokedex/shared";
import { cacheLife, cacheTag } from "next/cache";
import { fetchAllPokemon, fetchPokemon, fetchTypes } from "@/features/pokemon/data/api/pokeapi";
import { toPokemonDetail, toPokemonSummary, toTypeNames } from "@/features/pokemon/data/mappers/pokemon";
import { customPokemonRepository, type NewCustomPokemon } from "@/features/pokemon/data/repository";
import type { PokemonDetail, PokemonSummary } from "@/features/pokemon/types";
import { CUSTOM_POKEMON_TAG, pokemonDetailTag } from "@/features/pokemon/config/constants";
import { mergePokemon, searchPokemon } from "./search";

async function getCustomPokemon(): Promise<PokemonDetail[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CUSTOM_POKEMON_TAG);
  return customPokemonRepository.list();
}

function toSummary({ id, name, imageUrl, isCustom }: PokemonDetail): PokemonSummary {
  return { id, name, imageUrl, isCustom };
}

async function getAllPokemon(): Promise<PokemonSummary[]> {
  const [custom, list] = await Promise.all([getCustomPokemon(), fetchAllPokemon()]);
  return mergePokemon(custom.map(toSummary), list.results.map(toPokemonSummary));
}

export async function getPokemonPage(query: string, page: number): Promise<Paginated<PokemonSummary>> {
  return searchPokemon(await getAllPokemon(), { query, page });
}

/** Custom pokemon win lookups; names can't collide because the action rejects taken names. */
export async function getPokemonDetail(name: string): Promise<PokemonDetail | null> {
  const custom = (await getCustomPokemon()).find((p) => p.name === name);
  if (custom) return custom;

  return getApiPokemonDetail(name);
}

/** Caches the mapped detail, not PokéAPI's raw response, so far more entries fit in the cache. */
async function getApiPokemonDetail(name: string): Promise<PokemonDetail | null> {
  "use cache";
  cacheLife("weeks");
  cacheTag(pokemonDetailTag(name));

  const fromApi = await fetchPokemon(name);
  return fromApi ? toPokemonDetail(fromApi) : null;
}

export async function getTypeNames(): Promise<string[]> {
  return toTypeNames(await fetchTypes());
}

export async function getTakenNames(): Promise<Set<string>> {
  return new Set((await getAllPokemon()).map((p) => p.name));
}

export async function addCustomPokemon(input: NewCustomPokemon): Promise<PokemonDetail> {
  return customPokemonRepository.create(input);
}

export async function deleteCustomPokemon(id: string): Promise<boolean> {
  return customPokemonRepository.delete(id);
}
