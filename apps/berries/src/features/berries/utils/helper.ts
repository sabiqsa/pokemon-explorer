import { displayName } from "@pokedex/shared";
import { EMPTY_VALUE } from "@/features/berries/config/constants";

/** "cheri" -> "Cheri Berry" */
export function berryDisplayName(name: string): string {
  return `${displayName(name)} Berry`;
}

/** "1" -> "#01"; custom IDs get a label instead of a number. */
export function displayId(id: string, isCustom: boolean): string {
  return isCustom ? "Custom" : `#${id.padStart(2, "0")}`;
}

/**
 * One rule for values PokéAPI leaves empty: 0 or null shows as "—".
 * Otherwise the number, with an optional unit ("20 mm").
 */
export function formatValue(value: number | null, unit?: string): string {
  if (value === null || value === 0) return EMPTY_VALUE;
  return unit ? `${value} ${unit}` : String(value);
}
