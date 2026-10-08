// Pure validation for the "add custom pokemon" form. Runs on the server inside the action.
import type { NewCustomPokemon } from "@/features/pokemon/data/repository";
import type { StatName } from "@/features/pokemon/types";
import { MAX_TYPES, NAME_MAX_LENGTH, NAME_PATTERN, STAT_MAX, STAT_MIN, STAT_NAMES } from "@/features/pokemon/config/constants";
import { toSlug } from "@/features/pokemon/utils/helper";

export type NewPokemonField = "name" | "types" | "abilities" | StatName;
export type FieldErrors = Partial<Record<NewPokemonField, string>>;

export type RawNewPokemon = {
  name: string;
  types: string[];
  abilities: string;
  stats: Record<StatName, string>;
};

export type ValidationResult =
  | { ok: true; value: NewCustomPokemon }
  | { ok: false; errors: FieldErrors };

export function validateNewPokemon(
  raw: RawNewPokemon,
  { validTypes, isNameTaken }: { validTypes: string[]; isNameTaken: (name: string) => boolean },
): ValidationResult {
  const errors: FieldErrors = {};

  const name = raw.name.trim().toLowerCase();
  if (!name) errors.name = "Name is required.";
  else if (name.length > NAME_MAX_LENGTH) errors.name = `Name must be at most ${NAME_MAX_LENGTH} characters.`;
  else if (!NAME_PATTERN.test(name)) errors.name = "Use lowercase letters, numbers and single hyphens only.";
  else if (isNameTaken(name)) errors.name = "A pokemon with this name already exists.";

  const types = [...new Set(raw.types)];
  if (types.length === 0) errors.types = "Pick at least one type.";
  else if (types.length > MAX_TYPES) errors.types = `Pick at most ${MAX_TYPES} types.`;
  else if (types.some((t) => !validTypes.includes(t))) errors.types = "Unknown type selected.";

  const abilities = [
    ...new Set(
      raw.abilities
        .split(",")
        .map(toSlug)
        .filter(Boolean),
    ),
  ];
  if (abilities.length === 0) errors.abilities = "Add at least one ability.";

  const stats = STAT_NAMES.map((statName) => {
    const value = Number(raw.stats[statName]);
    if (!Number.isInteger(value) || value < STAT_MIN || value > STAT_MAX) {
      errors[statName] = `Must be a whole number from ${STAT_MIN} to ${STAT_MAX}.`;
    }
    return { name: statName, value };
  });

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, types, abilities, stats } };
}
