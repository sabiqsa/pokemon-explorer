// Domain types: shaped for what the UI needs, not what PokéAPI returns.
import type { STAT_NAMES } from "./config/constants";

export type StatName = (typeof STAT_NAMES)[number];

export type PokemonStat = {
  name: StatName;
  value: number;
};

/** What a list card needs. */
export type PokemonSummary = {
  /** PokéAPI ID as a string ("25"), or `custom-<uuid>` for user-created entries. */
  id: string;
  name: string;
  imageUrl: string | null;
  isCustom: boolean;
};

/** What the detail page needs. */
export type PokemonDetail = PokemonSummary & {
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
};
