import { chmod, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { isStorageUnavailableError } from "@pokedex/shared";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CUSTOM_ID_PREFIX } from "@/features/berries/config/constants";
import { createJsonCustomBerryRepository } from "./json-custom-berry-repository";

const input = {
  name: "moonglow",
  firmness: "soft",
  flavors: [{ name: "sweet" as const, potency: 25 }],
  sizeMm: 40,
  growthTimeHours: 12,
  maxHarvest: 5,
  effect: null,
};

describe("JSON custom berry repository", () => {
  let dir: string;
  let filePath: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "custom-berries-"));
    filePath = path.join(dir, "data", "custom-berries.json");
  });

  afterEach(async () => {
    await chmod(dir, 0o755);
    await rm(dir, { recursive: true, force: true });
  });

  it("lists nothing before the file exists", async () => {
    expect(await createJsonCustomBerryRepository(filePath).list()).toEqual([]);
  });

  it("creates prefixed, custom-flagged entries with no natural gift, and persists them", async () => {
    const created = await createJsonCustomBerryRepository(filePath).create(input);

    expect(created.id.startsWith(CUSTOM_ID_PREFIX)).toBe(true);
    expect(created).toMatchObject({
      ...input,
      imageUrl: null,
      isCustom: true,
      naturalGiftType: null,
      naturalGiftPower: null,
    });
    expect(await createJsonCustomBerryRepository(filePath).list()).toEqual([created]);
  });

  it("appends instead of overwriting", async () => {
    const repo = createJsonCustomBerryRepository(filePath);
    await repo.create(input);
    await repo.create({ ...input, name: "sunpetal" });
    expect((await repo.list()).map((b) => b.name)).toEqual(["moonglow", "sunpetal"]);
  });

  it("deletes by ID and keeps the rest", async () => {
    const repo = createJsonCustomBerryRepository(filePath);
    const first = await repo.create(input);
    const second = await repo.create({ ...input, name: "sunpetal" });

    expect(await repo.delete(first.id)).toBe(true);
    expect(await repo.list()).toEqual([second]);
  });

  it("reports false when deleting an unknown ID", async () => {
    const repo = createJsonCustomBerryRepository(filePath);
    await repo.create(input);
    expect(await repo.delete("custom-missing")).toBe(false);
    expect(await repo.list()).toHaveLength(1);
  });

  it.skipIf(process.getuid?.() === 0)(
    "fails with a storage-unavailable error when the folder is read-only (like a serverless deploy)",
    async () => {
      await chmod(dir, 0o555);
      const error = await createJsonCustomBerryRepository(filePath).create(input).catch((e: unknown) => e);
      expect(isStorageUnavailableError(error)).toBe(true);
    },
  );
});
