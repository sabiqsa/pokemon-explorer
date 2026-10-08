import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CUSTOM_ID_PREFIX } from "@/features/pokemon/config/constants";
import { createJsonCustomPokemonRepository } from "./json-custom-pokemon-repository";

const input = {
  name: "sparkymon",
  types: ["electric"],
  abilities: ["static"],
  stats: [{ name: "hp" as const, value: 50 }],
};

describe("JSON custom pokemon repository", () => {
  let dir: string;
  let filePath: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "custom-pokemon-"));
    // Nested folder that doesn't exist yet, to check `create` makes it.
    filePath = path.join(dir, "data", "custom-pokemon.json");
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("lists nothing before the file exists", async () => {
    expect(await createJsonCustomPokemonRepository(filePath).list()).toEqual([]);
  });

  it("creates prefixed, custom-flagged entries and persists them", async () => {
    const repo = createJsonCustomPokemonRepository(filePath);
    const created = await repo.create(input);

    expect(created.id.startsWith(CUSTOM_ID_PREFIX)).toBe(true);
    expect(created).toMatchObject({ ...input, imageUrl: null, isCustom: true });

    // A fresh instance reads it back from disk.
    expect(await createJsonCustomPokemonRepository(filePath).list()).toEqual([created]);
  });

  it("deletes by ID and keeps the rest", async () => {
    const repo = createJsonCustomPokemonRepository(filePath);
    const first = await repo.create(input);
    const second = await repo.create({ ...input, name: "voltmon" });

    expect(await repo.delete(first.id)).toBe(true);
    expect(await repo.list()).toEqual([second]);
  });

  it("reports false when deleting an unknown ID", async () => {
    const repo = createJsonCustomPokemonRepository(filePath);
    await repo.create(input);
    expect(await repo.delete("custom-missing")).toBe(false);
    expect(await repo.list()).toHaveLength(1);
  });

  it("appends instead of overwriting", async () => {
    const repo = createJsonCustomPokemonRepository(filePath);
    await repo.create(input);
    await repo.create({ ...input, name: "voltmon" });
    expect((await repo.list()).map((p) => p.name)).toEqual(["sparkymon", "voltmon"]);
  });
});
