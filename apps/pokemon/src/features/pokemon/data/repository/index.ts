import path from "node:path";
import type { CustomPokemonRepository } from "./custom-pokemon-repository";
import { createJsonCustomPokemonRepository } from "./json-custom-pokemon-repository";

export type { CustomPokemonRepository, NewCustomPokemon } from "./custom-pokemon-repository";

let repository: CustomPokemonRepository | undefined;

export function getCustomPokemonRepository(): CustomPokemonRepository {
  repository ??= createJsonCustomPokemonRepository(path.join(process.cwd(), "data", "custom-pokemon.json"));
  return repository;
}
