import path from "node:path";
import type { CustomBerryRepository } from "./custom-berry-repository";
import { createJsonCustomBerryRepository } from "./json-custom-berry-repository";

export type { CustomBerryRepository, NewCustomBerry } from "./custom-berry-repository";

let repository: CustomBerryRepository | undefined;

export function getCustomBerryRepository(): CustomBerryRepository {
  repository ??= createJsonCustomBerryRepository(path.join(process.cwd(), "data", "custom-berries.json"));
  return repository;
}
