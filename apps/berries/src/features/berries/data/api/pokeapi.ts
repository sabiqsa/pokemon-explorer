import { cacheLife, cacheTag } from "next/cache";
import {
  ALL_BERRIES_LIMIT,
  BERRY_FIRMNESS_TAG,
  BERRY_LIST_TAG,
  POKEAPI_BASE_URL,
} from "@/features/berries/config/constants";

export type ApiNamedResource = { name: string; url: string };

export type ApiBerryList = {
  count: number;
  results: ApiNamedResource[];
};

export type ApiBerry = {
  id: number;
  name: string;
  growth_time: number | null;
  max_harvest: number | null;
  natural_gift_power: number | null;
  size: number | null;
  firmness: ApiNamedResource | null;
  flavors: { potency: number; flavor: ApiNamedResource }[];
  item: ApiNamedResource;
  natural_gift_type: ApiNamedResource | null;
};

export type ApiItem = {
  name: string;
  effect_entries: { short_effect: string; effect: string; language: ApiNamedResource }[];
};

export type ApiFirmnessList = { results: ApiNamedResource[] };

async function getJsonFromUrl<T>(url: string): Promise<T | null> {
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`PokéAPI ${url} failed with ${res.status}`);
  return res.json() as Promise<T>;
}

const getJson = <T>(path: string) => getJsonFromUrl<T>(`${POKEAPI_BASE_URL}${path}`);

export async function fetchAllBerries(): Promise<ApiBerryList> {
  "use cache";
  cacheLife("weeks");
  cacheTag(BERRY_LIST_TAG);

  const list = await getJson<ApiBerryList>(`/berry?limit=${ALL_BERRIES_LIMIT}`);
  if (!list) throw new Error("PokéAPI berry list not found");
  return list;
}

export async function fetchBerry(name: string): Promise<ApiBerry | null> {
  return getJson<ApiBerry>(`/berry/${encodeURIComponent(name)}`);
}

export async function fetchItem(url: string): Promise<ApiItem | null> {
  return getJsonFromUrl<ApiItem>(url);
}

export async function fetchFirmnesses(): Promise<ApiFirmnessList> {
  "use cache";
  cacheLife("max");
  cacheTag(BERRY_FIRMNESS_TAG);

  const list = await getJson<ApiFirmnessList>("/berry-firmness");
  if (!list) throw new Error("PokéAPI berry firmness list not found");
  return list;
}
