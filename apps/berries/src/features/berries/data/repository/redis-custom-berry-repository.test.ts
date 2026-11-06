import { describe, expect, it } from "vitest";
import { CUSTOM_ID_PREFIX } from "@/features/berries/config/constants";
import { createRedisCustomBerryRepository, type RedisClient } from "./redis-custom-berry-repository";

function createFakeRedis(): RedisClient {
  const lists = new Map<string, string[]>();
  const hashes = new Map<string, Map<string, unknown>>();
  const hash = (key: string) => hashes.get(key) ?? hashes.set(key, new Map()).get(key)!;
  const list = (key: string) => lists.get(key) ?? lists.set(key, []).get(key)!;

  const fake = {
    async hset(key: string, values: Record<string, unknown>) {
      for (const [field, value] of Object.entries(values)) hash(key).set(field, structuredClone(value));
      return Object.keys(values).length;
    },
    async hmget(key: string, ...fields: string[]) {
      const entries = fields.filter((f) => hash(key).has(f)).map((f) => [f, structuredClone(hash(key).get(f))]);
      return entries.length ? Object.fromEntries(entries) : null;
    },
    async hdel(key: string, ...fields: string[]) {
      return fields.filter((f) => hash(key).delete(f)).length;
    },
    async rpush(key: string, ...values: string[]) {
      return list(key).push(...values);
    },
    async lrange(key: string) {
      return [...list(key)];
    },
    async lrem(key: string, _count: number, value: string) {
      const before = list(key).length;
      lists.set(key, list(key).filter((v) => v !== value));
      return before - list(key).length;
    },
  };
  return fake as unknown as RedisClient;
}

const input = {
  name: "moonglow",
  firmness: "soft",
  flavors: [{ name: "sweet" as const, potency: 25 }],
  sizeMm: 40,
  growthTimeHours: 12,
  maxHarvest: 5,
  effect: null,
};

describe("Redis custom berry repository", () => {
  it("lists nothing when empty", async () => {
    expect(await createRedisCustomBerryRepository(createFakeRedis(), "custom-berries").list()).toEqual([]);
  });

  it("creates prefixed, custom-flagged entries and lists them in insertion order", async () => {
    const redis = createFakeRedis();
    const repo = createRedisCustomBerryRepository(redis, "custom-berries");
    const first = await repo.create(input);
    const second = await repo.create({ ...input, name: "sunglow" });

    expect(first.id.startsWith(CUSTOM_ID_PREFIX)).toBe(true);
    expect(first).toMatchObject({ ...input, imageUrl: null, isCustom: true, naturalGiftType: null, naturalGiftPower: null });
    expect(await createRedisCustomBerryRepository(redis, "custom-berries").list()).toEqual([first, second]);
  });

  it("deletes by ID and keeps the rest", async () => {
    const repo = createRedisCustomBerryRepository(createFakeRedis(), "custom-berries");
    const first = await repo.create(input);
    const second = await repo.create({ ...input, name: "sunglow" });

    expect(await repo.delete(first.id)).toBe(true);
    expect(await repo.list()).toEqual([second]);
  });

  it("reports false when deleting an unknown ID", async () => {
    const repo = createRedisCustomBerryRepository(createFakeRedis(), "custom-berries");
    await repo.create(input);
    expect(await repo.delete("custom-missing")).toBe(false);
    expect(await repo.list()).toHaveLength(1);
  });
});
