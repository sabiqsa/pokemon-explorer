"use server";

import { saveErrorMessage, STORAGE_READ_ONLY_MESSAGE } from "@pokedex/shared";
import type { DeleteState } from "@pokedex/ui";
import { updateTag } from "next/cache";
import { CUSTOM_ID_PREFIX, CUSTOM_POKEMON_TAG } from "@/features/pokemon/config/constants";
import { deleteCustomPokemon, isCustomStorageReadOnly } from "@/features/pokemon/data/services/pokemon-service";

export async function deletePokemon(id: unknown): Promise<DeleteState> {
  if (isCustomStorageReadOnly()) return { error: STORAGE_READ_ONLY_MESSAGE };

  if (typeof id !== "string" || !id.startsWith(CUSTOM_ID_PREFIX)) {
    return { error: "Only custom pokemon can be deleted." };
  }

  let deleted;
  try {
    deleted = await deleteCustomPokemon(id);
  } catch (error) {
    console.error(error);
    return { error: saveErrorMessage(error) };
  }
  if (!deleted) {
    return { error: "This pokemon doesn't exist or was already deleted." };
  }

  updateTag(CUSTOM_POKEMON_TAG);
  return { deleted: true };
}
