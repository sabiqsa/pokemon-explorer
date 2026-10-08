import path from "node:path";
import { createJsonCustomPokemonRepository } from "./json-custom-pokemon-repository";

export type { CustomPokemonRepository, NewCustomPokemon } from "./custom-pokemon-repository";

export const customPokemonRepository = createJsonCustomPokemonRepository(
  path.join(process.cwd(), "data", "custom-pokemon.json"),
);
