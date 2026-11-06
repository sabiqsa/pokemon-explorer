export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const ALL_BERRIES_LIMIT = 1_000;

export const ITEM_SPRITE_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items";

export const BERRY_LIST_TAG = "berry-list";
export const BERRY_FIRMNESS_TAG = "berry-firmness";
export const CUSTOM_BERRIES_TAG = "custom-berries";
export const berryDetailTag = (name: string) => `berry:${name}`;

export const CUSTOM_ID_PREFIX = "custom-";

export const FLAVOR_NAMES = ["spicy", "dry", "sweet", "bitter", "sour"] as const;

export const FLAVOR_MIN = 0;
export const FLAVOR_MAX = 40;
export const DEFAULT_FLAVOR = "0";

export const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 30;
export const SIZE_MIN = 1;
export const SIZE_MAX = 300;
export const GROWTH_TIME_MIN = 1;
export const GROWTH_TIME_MAX = 72;
export const MAX_HARVEST_MIN = 1;
export const MAX_HARVEST_MAX = 50;
export const EFFECT_MAX_LENGTH = 200;


export const EMPTY_VALUE = "—";
