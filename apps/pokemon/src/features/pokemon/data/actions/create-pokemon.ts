"use server";

import { saveErrorMessage } from "@pokedex/shared";
import { updateTag } from "next/cache";
import { addCustomPokemon, getTakenNames, getTypeNames } from "@/features/pokemon/data/services/pokemon-service";
import { validateNewPokemon, type FieldErrors, type RawNewPokemon } from "@/features/pokemon/data/services/validate";
import type { StatName } from "@/features/pokemon/types";
import { CUSTOM_POKEMON_TAG, STAT_NAMES } from "@/features/pokemon/config/constants";

export type CreatePokemonState = {
  errors?: FieldErrors;
  formError?: string;
  createdName?: string;
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
  if (!(formData instanceof FormData)) return { formError: "Invalid form submission." };

  const values = readForm(formData);
  const [validTypes, takenNames] = await Promise.all([getTypeNames(), getTakenNames()]);
  const result = validateNewPokemon(values, {
    validTypes,
    isNameTaken: (name) => takenNames.has(name),
  });

  if (!result.ok) return { errors: result.errors, values };

  let pokemon;
  try {
    pokemon = await addCustomPokemon(result.value);
  } catch (error) {
    console.error(error);
    return { formError: saveErrorMessage(error, "pokemon"), values };
  }

  updateTag(CUSTOM_POKEMON_TAG);
  return { createdName: pokemon.name, values };
}
