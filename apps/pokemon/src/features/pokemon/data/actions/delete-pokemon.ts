"use server";

import { saveErrorMessage } from "@pokedex/shared";
import type { DeleteState } from "@pokedex/ui";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CUSTOM_ID_PREFIX, CUSTOM_POKEMON_TAG } from "@/features/pokemon/config/constants";
import { deleteCustomPokemon } from "@/features/pokemon/data/services/pokemon-service";

export async function deletePokemon(id: unknown): Promise<DeleteState> {
  if (typeof id !== "string" || !id.startsWith(CUSTOM_ID_PREFIX)) {
    return { error: "Only custom pokemon can be deleted." };
  }

  let deleted;
  try {
    deleted = await deleteCustomPokemon(id);
  } catch (error) {
    console.error(error);
    return { error: saveErrorMessage(error, "pokemon") };
  }
  if (!deleted) {
    return { error: "This pokemon doesn't exist or was already deleted." };
  }

  updateTag(CUSTOM_POKEMON_TAG);
  redirect("/");
}
