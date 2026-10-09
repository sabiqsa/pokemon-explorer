"use server";

import { saveErrorMessage } from "@pokedex/shared";
import type { DeleteState } from "@pokedex/ui";
import { updateTag } from "next/cache";
import { CUSTOM_BERRIES_TAG, CUSTOM_ID_PREFIX } from "@/features/berries/config/constants";
import { deleteCustomBerry } from "@/features/berries/data/services/berry-service";

export async function deleteBerry(id: unknown): Promise<DeleteState> {
  if (typeof id !== "string" || !id.startsWith(CUSTOM_ID_PREFIX)) {
    return { error: "Only custom berries can be deleted." };
  }

  let deleted;
  try {
    deleted = await deleteCustomBerry(id);
  } catch (error) {
    console.error(error);
    return { error: saveErrorMessage(error, "berries") };
  }
  if (!deleted) {
    return { error: "This berry doesn't exist or was already deleted." };
  }

  updateTag(CUSTOM_BERRIES_TAG);
  return { deleted: true };
}
