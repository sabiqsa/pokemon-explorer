"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { addCustomPokemon, getTakenNames, getTypeNames } from "@/features/pokemon/data/services/pokemon-service";
import { validateNewPokemon, type FieldErrors, type RawNewPokemon } from "@/features/pokemon/data/services/validate";
import type { StatName } from "@/features/pokemon/types";
import { CUSTOM_POKEMON_TAG, STAT_NAMES } from "@/features/pokemon/config/constants";

export type CreatePokemonState = {
  errors?: FieldErrors;
  /** Echoed back so the form can keep what the user typed after a failed submit. */
  values?: RawNewPokemon;
};

function readForm(formData: FormData): RawNewPokemon {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    name: text("name"),
    types: formData.getAll("types").filter((t): t is string => typeof t === "string"),
    abilities: text("abilities"),
    stats: Object.fromEntries(STAT_NAMES.map((stat) => [stat, text(stat)])) as Record<StatName, string>,
  };
}

export async function createPokemon(
  _previous: CreatePokemonState,
  formData: FormData,
): Promise<CreatePokemonState> {
  const values = readForm(formData);
  const [validTypes, takenNames] = await Promise.all([getTypeNames(), getTakenNames()]);
  const result = validateNewPokemon(values, {
    validTypes,
    isNameTaken: (name) => takenNames.has(name),
  });

  if (!result.ok) return { errors: result.errors, values };

  const pokemon = await addCustomPokemon(result.value);
  // Expire the cached custom list now, so the list and detail pages show the new entry immediately.
  updateTag(CUSTOM_POKEMON_TAG);
  redirect(`/${pokemon.name}`);
}
