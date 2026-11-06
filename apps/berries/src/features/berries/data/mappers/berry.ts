import type { ApiBerry, ApiFirmnessList, ApiItem, ApiNamedResource } from "@/features/berries/data/api/pokeapi";
import type { BerryDetail, BerryFlavor, BerrySummary, FlavorName } from "@/features/berries/types";
import { FLAVOR_NAMES, ITEM_SPRITE_BASE_URL } from "@/features/berries/config/constants";

export function idFromResourceUrl(url: string): string {
  const id = url.match(/\/(\d+)\/?$/)?.[1];
  if (!id) throw new Error(`No ID in PokéAPI URL: ${url}`);
  return id;
}

export function berrySpriteUrl(name: string): string {
  return `${ITEM_SPRITE_BASE_URL}/${name}-berry.png`;
}

export function toBerrySummary(resource: ApiNamedResource): BerrySummary {
  return {
    id: idFromResourceUrl(resource.url),
    name: resource.name,
    imageUrl: berrySpriteUrl(resource.name),
    isCustom: false,
  };
}

function isFlavorName(name: string): name is FlavorName {
  return (FLAVOR_NAMES as readonly string[]).includes(name);
}

export function toFlavors(api: ApiBerry["flavors"]): BerryFlavor[] {
  if (api.length === 0) return [];
  const potencies = new Map<string, number>();
  for (const entry of api) {
    if (isFlavorName(entry.flavor.name)) potencies.set(entry.flavor.name, entry.potency);
  }
  return FLAVOR_NAMES.map((name) => ({ name, potency: potencies.get(name) ?? 0 }));
}

export function englishShortEffect(item: ApiItem | null): string | null {
  const entry = item?.effect_entries.find((e) => e.language.name === "en");
  return entry ? entry.short_effect.replace(/\s+/g, " ").trim() : null;
}

export function toBerryDetail(berry: ApiBerry, item: ApiItem | null): BerryDetail {
  return {
    id: String(berry.id),
    name: berry.name,
    imageUrl: berrySpriteUrl(berry.name),
    isCustom: false,
    firmness: berry.firmness?.name ?? null,
    flavors: toFlavors(berry.flavors),
    sizeMm: berry.size,
    growthTimeHours: berry.growth_time,
    maxHarvest: berry.max_harvest,
    naturalGiftType: berry.natural_gift_type?.name ?? null,
    naturalGiftPower: berry.natural_gift_power,
    effect: englishShortEffect(item),
  };
}

export function toFirmnessNames(list: ApiFirmnessList): string[] {
  return list.results.map((f) => f.name);
}
