import type { StatName } from "@/features/pokemon/types";

// --- PokéAPI ---

export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

// High enough to cover every entry (PokéAPI has ~1,350), so search can run locally.
export const ALL_POKEMON_LIMIT = 100_000;

export const ARTWORK_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

// Types PokéAPI lists that no real pokemon can have.
export const NON_PLAYABLE_TYPES = new Set(["unknown", "stellar", "shadow"]);

// --- Cache tags ---

export const POKEMON_LIST_TAG = "pokemon-list";
export const POKEMON_TYPES_TAG = "pokemon-types";
export const CUSTOM_POKEMON_TAG = "custom-pokemon";
export const pokemonDetailTag = (name: string) => `pokemon:${name}`;

// --- Custom pokemon ---

/** Prefix for custom pokemon IDs so they never collide with PokéAPI's numeric IDs. */
export const CUSTOM_ID_PREFIX = "custom-";

// --- Stats ---

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

// Highest base stat in the games is 255; also the scale for stat bars.
export const STAT_MIN = 1;
export const STAT_MAX = 255;
export const DEFAULT_STAT = "50";

// --- Validation ---

export const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const NAME_MAX_LENGTH = 30;
export const MAX_TYPES = 2;

// --- List & search ---

export const PAGE_SIZE = 24;
export const SEARCH_DEBOUNCE_MS = 300;
