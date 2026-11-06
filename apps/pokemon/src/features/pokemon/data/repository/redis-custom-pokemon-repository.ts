import { randomUUID } from "node:crypto";
import type { Redis } from "@upstash/redis";
import type { PokemonDetail } from "@/features/pokemon/types";
import { CUSTOM_ID_PREFIX } from "@/features/pokemon/config/constants";
import type { CustomPokemonRepository, NewCustomPokemon } from "./custom-pokemon-repository";

export type RedisClient = Pick<Redis, "hset" | "hmget" | "hdel" | "rpush" | "lrange" | "lrem">;

export function createRedisCustomPokemonRepository(redis: RedisClient, key: string): CustomPokemonRepository {
  const idsKey = `${key}:ids`;
  const entriesKey = `${key}:entries`;

  return {
    async list() {
      const ids = await redis.lrange(idsKey, 0, -1);
      if (ids.length === 0) return [];
      const entries = await redis.hmget<Record<string, PokemonDetail>>(entriesKey, ...ids);
      return ids.flatMap((id) => (entries?.[id] ? [entries[id]] : []));
    },

    async create(input: NewCustomPokemon) {
      const pokemon: PokemonDetail = {
        ...input,
        id: `${CUSTOM_ID_PREFIX}${randomUUID()}`,
        imageUrl: null,
        isCustom: true,
      };
      await redis.hset(entriesKey, { [pokemon.id]: pokemon });
      await redis.rpush(idsKey, pokemon.id);
      return pokemon;
    },

    async delete(id: string) {
      const removed = await redis.hdel(entriesKey, id);
      await redis.lrem(idsKey, 0, id);
      return removed > 0;
    },
  };
}
