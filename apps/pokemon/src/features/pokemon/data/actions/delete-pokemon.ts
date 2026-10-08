"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CUSTOM_ID_PREFIX, CUSTOM_POKEMON_TAG } from "@/features/pokemon/config/constants";
import { deleteCustomPokemon } from "@/features/pokemon/data/services/pokemon-service";

export type DeletePokemonState = { error?: string };

// Bound to the ID in the form; useActionState's previous state and form data are not needed.
export async function deletePokemon(id: string): Promise<DeletePokemonState> {
  // Checked on the server, so a crafted request can't target PokéAPI pokemon.
  if (!id.startsWith(CUSTOM_ID_PREFIX)) {
    return { error: "Only custom pokemon can be deleted." };
  }

  const deleted = await deleteCustomPokemon(id);
  if (!deleted) {
    return { error: "This pokemon was already deleted." };
  }

  updateTag(CUSTOM_POKEMON_TAG);
  redirect("/");
}
