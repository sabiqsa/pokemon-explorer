import type { NewCustomBerry } from "@/features/berries/data/repository";
import type { FlavorName } from "@/features/berries/types";
import {
  EFFECT_MAX_LENGTH,
  FLAVOR_MAX,
  FLAVOR_MIN,
  FLAVOR_NAMES,
  GROWTH_TIME_MAX,
  GROWTH_TIME_MIN,
  MAX_HARVEST_MAX,
  MAX_HARVEST_MIN,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NAME_PATTERN,
  SIZE_MAX,
  SIZE_MIN,
} from "@/features/berries/config/constants";
import { normalizeBerryQuery } from "./search";

export type NewBerryField = "name" | "firmness" | "flavors" | "sizeMm" | "growthTimeHours" | "maxHarvest" | "effect" | FlavorName;
export type FieldErrors = Partial<Record<NewBerryField, string>>;

export type RawNewBerry = {
  name: string;
  firmness: string;
  flavors: Record<FlavorName, string>;
  sizeMm: string;
  growthTimeHours: string;
  maxHarvest: string;
  effect: string;
};

export type ValidationResult =
  | { ok: true; value: NewCustomBerry }
  | { ok: false; errors: FieldErrors };

function parseWholeNumber(raw: string, min: number, max: number): number | string {
  const value = Number(raw);
  if (raw.trim() === "" || !Number.isInteger(value) || value < min || value > max) {
    return `Must be a whole number from ${min} to ${max}.`;
  }
  return value;
}

export function validateNewBerry(
  raw: RawNewBerry,
  { validFirmnesses, isNameTaken }: { validFirmnesses: string[]; isNameTaken: (name: string) => boolean },
): ValidationResult {
  const errors: FieldErrors = {};

  const name = normalizeBerryQuery(raw.name);
  if (!name) errors.name = "Name is required.";
  else if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    errors.name = `Name must be ${NAME_MIN_LENGTH} to ${NAME_MAX_LENGTH} characters.`;
  } else if (!NAME_PATTERN.test(name)) errors.name = "Use letters, numbers and single hyphens only.";
  else if (isNameTaken(name)) errors.name = "A berry with this name already exists.";

  if (!raw.firmness) errors.firmness = "Pick a firmness.";
  else if (!validFirmnesses.includes(raw.firmness)) errors.firmness = "Unknown firmness selected.";

  const flavors = FLAVOR_NAMES.map((flavor) => {
    const parsed = parseWholeNumber(raw.flavors[flavor], FLAVOR_MIN, FLAVOR_MAX);
    if (typeof parsed === "string") errors[flavor] = parsed;
    return { name: flavor, potency: typeof parsed === "number" ? parsed : 0 };
  });
  const flavorsValid = FLAVOR_NAMES.every((flavor) => !errors[flavor]);
  if (flavorsValid && flavors.every((f) => f.potency === 0)) {
    errors.flavors = "Give at least one flavor a potency above 0.";
  }

  const numbers = {
    sizeMm: parseWholeNumber(raw.sizeMm, SIZE_MIN, SIZE_MAX),
    growthTimeHours: parseWholeNumber(raw.growthTimeHours, GROWTH_TIME_MIN, GROWTH_TIME_MAX),
    maxHarvest: parseWholeNumber(raw.maxHarvest, MAX_HARVEST_MIN, MAX_HARVEST_MAX),
  };
  for (const [field, parsed] of Object.entries(numbers)) {
    if (typeof parsed === "string") errors[field as keyof typeof numbers] = parsed;
  }

  const effect = raw.effect.trim().replace(/\s+/g, " ");
  if (effect.length > EFFECT_MAX_LENGTH) errors.effect = `Keep the effect under ${EFFECT_MAX_LENGTH} characters.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name,
      firmness: raw.firmness,
      flavors,
      sizeMm: numbers.sizeMm as number,
      growthTimeHours: numbers.growthTimeHours as number,
      maxHarvest: numbers.maxHarvest as number,
      effect: effect || null,
    },
  };
}
