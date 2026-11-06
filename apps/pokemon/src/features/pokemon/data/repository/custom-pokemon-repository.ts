import type { PokemonDetail } from "@/features/pokemon/types";

export type NewCustomPokemon = Omit<PokemonDetail, "id" | "imageUrl" | "isCustom">;

export interface CustomPokemonRepository {
  list(): Promise<PokemonDetail[]>;
  create(input: NewCustomPokemon): Promise<PokemonDetail>;
  delete(id: string): Promise<boolean>;
}
