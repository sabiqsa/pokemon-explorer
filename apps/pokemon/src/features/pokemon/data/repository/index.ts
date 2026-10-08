import path from "node:path";
import { createJsonCustomPokemonRepository } from "./json-custom-pokemon-repository";

export type { CustomPokemonRepository, NewCustomPokemon } from "./custom-pokemon-repository";

// `next dev` runs with the app folder as cwd, so this lands in apps/pokemon/data/.
export const customPokemonRepository = createJsonCustomPokemonRepository(
  path.join(process.cwd(), "data", "custom-pokemon.json"),
);
