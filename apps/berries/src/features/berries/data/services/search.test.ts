import { describe, expect, it } from "vitest";
import type { BerrySummary } from "@/features/berries/types";
import { mergeBerries, normalizeBerryQuery, searchBerries } from "./search";

const summary = (id: string, name: string, isCustom = false): BerrySummary => ({
  id,
  name,
  imageUrl: null,
  isCustom,
});

const fromApi = [summary("1", "cheri"), summary("2", "chesto"), summary("7", "oran"), summary("10", "sitrus")];
const custom = [summary("custom-a", "moonglow", true)];
const all = mergeBerries(custom, fromApi);

describe("normalizeBerryQuery", () => {
  it("drops a trailing 'berry' so 'Oran Berry' finds 'oran'", () => {
    expect(normalizeBerryQuery("  Oran Berry ")).toBe("oran");
    expect(normalizeBerryQuery("oran-berry")).toBe("oran");
    expect(normalizeBerryQuery("oranberry")).toBe("oran");
  });

  it("leaves other queries as slugs", () => {
    expect(normalizeBerryQuery("CHE")).toBe("che");
  });
});

describe("mergeBerries", () => {
  it("puts custom berries first", () => {
    expect(all.map((b) => b.name)).toEqual(["moonglow", "cheri", "chesto", "oran", "sitrus"]);
  });
});

describe("searchBerries", () => {
  it("returns everything when the query is empty", () => {
    expect(searchBerries(all, {})).toMatchObject({ total: 5, totalPages: 1 });
  });

  it("matches substrings case-insensitively", () => {
    expect(searchBerries(all, { query: "CHE" }).items.map((b) => b.name)).toEqual(["cheri", "chesto"]);
  });

  it("matches the full display name", () => {
    expect(searchBerries(all, { query: "Sitrus Berry" }).items.map((b) => b.name)).toEqual(["sitrus"]);
  });

  it("includes custom berries", () => {
    expect(searchBerries(all, { query: "moon" }).items[0]?.isCustom).toBe(true);
  });

  it("paginates the filtered results, not the full list", () => {
    const result = searchBerries(all, { query: "che", page: 2, pageSize: 1 });
    expect(result.items.map((b) => b.name)).toEqual(["chesto"]);
    expect(result).toMatchObject({ page: 2, total: 2, totalPages: 2 });
  });

  it("returns an empty page when nothing matches", () => {
    expect(searchBerries(all, { query: "zzz" })).toMatchObject({ items: [], total: 0, totalPages: 1 });
  });
});
