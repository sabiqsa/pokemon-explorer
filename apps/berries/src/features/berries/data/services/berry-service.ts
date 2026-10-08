import "server-only";
import type { PaginationResult } from "@pokedex/shared";
import { cacheLife, cacheTag } from "next/cache";
import { fetchAllBerries, fetchBerry, fetchFirmnesses, fetchItem } from "@/features/berries/data/api/pokeapi";
import { toBerryDetail, toBerrySummary, toFirmnessNames } from "@/features/berries/data/mappers/berry";
import { customBerryRepository, type NewCustomBerry } from "@/features/berries/data/repository";
import type { BerryDetail, BerrySummary } from "@/features/berries/types";
import { berryDetailTag, CUSTOM_BERRIES_TAG, NAME_PATTERN } from "@/features/berries/config/constants";
import { mergeBerries, searchBerries } from "./search";

async function getCustomBerries(): Promise<BerryDetail[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CUSTOM_BERRIES_TAG);
  return customBerryRepository.list();
}

function toSummary({ id, name, imageUrl, isCustom }: BerryDetail): BerrySummary {
  return { id, name, imageUrl, isCustom };
}

async function getAllBerries(): Promise<BerrySummary[]> {
  const [custom, list] = await Promise.all([getCustomBerries(), fetchAllBerries()]);
  return mergeBerries(custom.map(toSummary), list.results.map(toBerrySummary));
}

export async function getBerryPage(query: string, page: number): Promise<PaginationResult<BerrySummary>> {
  return searchBerries(await getAllBerries(), { query, page });
}

export async function getBerryDetail(name: string): Promise<BerryDetail | null> {
  if (!NAME_PATTERN.test(name)) return null;

  const custom = (await getCustomBerries()).find((b) => b.name === name);
  if (custom) return custom;

  return getApiBerryDetail(name);
}

async function getApiBerryDetail(name: string): Promise<BerryDetail | null> {
  "use cache";
  cacheLife("weeks");
  cacheTag(berryDetailTag(name));

  const berry = await fetchBerry(name);
  if (!berry) return null;
  const item = await fetchItem(berry.item.url);
  return toBerryDetail(berry, item);
}

export async function getFirmnessNames(): Promise<string[]> {
  return toFirmnessNames(await fetchFirmnesses());
}

export async function getTakenNames(): Promise<Set<string>> {
  return new Set((await getAllBerries()).map((b) => b.name));
}

export async function addCustomBerry(input: NewCustomBerry): Promise<BerryDetail> {
  return customBerryRepository.create(input);
}

export async function deleteCustomBerry(id: string): Promise<boolean> {
  return customBerryRepository.delete(id);
}
