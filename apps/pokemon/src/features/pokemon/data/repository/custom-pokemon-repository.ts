import type { PokemonDetail } from "@/features/pokemon/types";

export type NewCustomPokemon = Omit<PokemonDetail, "id" | "imageUrl" | "isCustom">;

/** Storage for user-created pokemon. Swap the implementation (e.g. a DB) without touching callers. */
export interface CustomPokemonRepository {
  list(): Promise<PokemonDetail[]>;
  create(input: NewCustomPokemon): Promise<PokemonDetail>;
  /** Returns false when no entry has this ID. */
  delete(id: string): Promise<boolean>;
}
