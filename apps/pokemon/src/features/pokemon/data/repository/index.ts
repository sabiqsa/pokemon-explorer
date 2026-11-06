import path from "node:path";
import { redisConfigFromEnv } from "@pokedex/shared";
import { Redis } from "@upstash/redis";
import type { CustomPokemonRepository } from "./custom-pokemon-repository";
import { createJsonCustomPokemonRepository } from "./json-custom-pokemon-repository";
import { createRedisCustomPokemonRepository } from "./redis-custom-pokemon-repository";

export type { CustomPokemonRepository, NewCustomPokemon } from "./custom-pokemon-repository";

let repository: CustomPokemonRepository | undefined;

function createRepository(): CustomPokemonRepository {
  const redis = redisConfigFromEnv(process.env);
  if (redis) return createRedisCustomPokemonRepository(new Redis(redis), "custom-pokemon");
  return createJsonCustomPokemonRepository(path.join(process.cwd(), "data", "custom-pokemon.json"));
}

export function getCustomPokemonRepository(): CustomPokemonRepository {
  repository ??= createRepository();
  return repository;
}
