import { randomUUID } from "node:crypto";
import type { Redis } from "@upstash/redis";
import type { BerryDetail } from "@/features/berries/types";
import { CUSTOM_ID_PREFIX } from "@/features/berries/config/constants";
import type { CustomBerryRepository, NewCustomBerry } from "./custom-berry-repository";

export type RedisClient = Pick<Redis, "hset" | "hmget" | "hdel" | "rpush" | "lrange" | "lrem">;

export function createRedisCustomBerryRepository(redis: RedisClient, key: string): CustomBerryRepository {
  const idsKey = `${key}:ids`;
  const entriesKey = `${key}:entries`;

  return {
    async list() {
      const ids = await redis.lrange(idsKey, 0, -1);
      if (ids.length === 0) return [];
      const entries = await redis.hmget<Record<string, BerryDetail>>(entriesKey, ...ids);
      return ids.flatMap((id) => (entries?.[id] ? [entries[id]] : []));
    },

    async create(input: NewCustomBerry) {
      const berry: BerryDetail = {
        ...input,
        id: `${CUSTOM_ID_PREFIX}${randomUUID()}`,
        imageUrl: null,
        isCustom: true,
        naturalGiftType: null,
        naturalGiftPower: null,
      };
      await redis.hset(entriesKey, { [berry.id]: berry });
      await redis.rpush(idsKey, berry.id);
      return berry;
    },

    async delete(id: string) {
      const removed = await redis.hdel(entriesKey, id);
      await redis.lrem(idsKey, 0, id);
      return removed > 0;
    },
  };
}
