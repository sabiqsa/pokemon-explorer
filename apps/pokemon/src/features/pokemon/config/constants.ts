import type { StatName } from "@/features/pokemon/types";

export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const ALL_POKEMON_LIMIT = 100_000;

export const ARTWORK_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export const NON_PLAYABLE_TYPES = new Set(["unknown", "stellar", "shadow"]);

export const POKEMON_LIST_TAG = "pokemon-list";
export const POKEMON_TYPES_TAG = "pokemon-types";
export const CUSTOM_POKEMON_TAG = "custom-pokemon";
export const pokemonDetailTag = (name: string) => `pokemon:${name}`;

export const CUSTOM_ID_PREFIX = "custom-";

export const STAT_NAMES = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
] as const;

export const STAT_LABELS: Record<StatName, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export const STAT_MIN = 1;
export const STAT_MAX = 255;
export const DEFAULT_STAT = "50";

export const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const NAME_MAX_LENGTH = 30;
export const MAX_TYPES = 2;

