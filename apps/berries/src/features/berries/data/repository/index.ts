import path from "node:path";
import { redisConfigFromEnv } from "@pokedex/shared";
import { Redis } from "@upstash/redis";
import type { CustomBerryRepository } from "./custom-berry-repository";
import { createJsonCustomBerryRepository } from "./json-custom-berry-repository";
import { createRedisCustomBerryRepository } from "./redis-custom-berry-repository";

export type { CustomBerryRepository, NewCustomBerry } from "./custom-berry-repository";

let repository: CustomBerryRepository | undefined;

function createRepository(): CustomBerryRepository {
  const redis = redisConfigFromEnv(process.env);
  if (redis) return createRedisCustomBerryRepository(new Redis(redis), "custom-berries");
  return createJsonCustomBerryRepository(path.join(process.cwd(), "data", "custom-berries.json"));
}

export function getCustomBerryRepository(): CustomBerryRepository {
  repository ??= createRepository();
  return repository;
}
