"use server";

import { saveErrorMessage } from "@pokedex/shared";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { addCustomBerry, getFirmnessNames, getTakenNames } from "@/features/berries/data/services/berry-service";
import { validateNewBerry, type FieldErrors, type RawNewBerry } from "@/features/berries/data/services/validate";
import type { FlavorName } from "@/features/berries/types";
import { CUSTOM_BERRIES_TAG, FLAVOR_NAMES } from "@/features/berries/config/constants";

export type CreateBerryState = {
  errors?: FieldErrors;
  formError?: string;
  values?: RawNewBerry;
};

function readForm(formData: FormData): RawNewBerry {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    name: text("name"),
    firmness: text("firmness"),
    flavors: Object.fromEntries(FLAVOR_NAMES.map((flavor) => [flavor, text(flavor)])) as Record<FlavorName, string>,
    sizeMm: text("sizeMm"),
    growthTimeHours: text("growthTimeHours"),
    maxHarvest: text("maxHarvest"),
    effect: text("effect"),
  };
}

export async function createBerry(_previous: CreateBerryState, formData: FormData): Promise<CreateBerryState> {
  if (!(formData instanceof FormData)) return { formError: "Invalid form submission." };

  const values = readForm(formData);
  const [validFirmnesses, takenNames] = await Promise.all([getFirmnessNames(), getTakenNames()]);
  const result = validateNewBerry(values, {
    validFirmnesses,
    isNameTaken: (name) => takenNames.has(name),
  });

  if (!result.ok) return { errors: result.errors, values };

  let berry;
  try {
    berry = await addCustomBerry(result.value);
  } catch (error) {
    console.error(error);
    return { formError: saveErrorMessage(error, "berries"), values };
  }

  updateTag(CUSTOM_BERRIES_TAG);
  redirect(`/${berry.name}`);
}
