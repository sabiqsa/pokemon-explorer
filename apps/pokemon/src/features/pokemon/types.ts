import type { CatalogSummary } from "@pokedex/shared";
import type { STAT_NAMES } from "./config/constants";

export type StatName = (typeof STAT_NAMES)[number];

export type PokemonStat = {
  name: StatName;
  value: number;
};

export type PokemonSummary = CatalogSummary;

export type PokemonDetail = PokemonSummary & {
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
};
