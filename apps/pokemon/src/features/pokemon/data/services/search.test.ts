import { describe, expect, it } from "vitest";
import type { PokemonSummary } from "@/features/pokemon/types";
import { mergePokemon, searchPokemon } from "./search";

const summary = (id: string, name: string, isCustom = false): PokemonSummary => ({
  id,
  name,
  imageUrl: null,
  isCustom,
});

const fromApi = [
  summary("1", "bulbasaur"),
  summary("4", "charmander"),
  summary("5", "charmeleon"),
  summary("122", "mr-mime"),
];
const custom = [summary("custom-a", "sparkymon", true)];

describe("mergePokemon", () => {
  it("puts custom pokemon first", () => {
    expect(mergePokemon(custom, fromApi).map((p) => p.name)).toEqual([
      "sparkymon",
      "bulbasaur",
      "charmander",
      "charmeleon",
      "mr-mime",
    ]);
  });
});

describe("searchPokemon", () => {
  const all = mergePokemon(custom, fromApi);

  it("returns everything when the query is empty", () => {
    const result = searchPokemon(all, { pageSize: 10 });
    expect(result.total).toBe(5);
    expect(result.totalPages).toBe(1);
  });

  it("matches substrings case-insensitively", () => {
    expect(searchPokemon(all, { query: "CHARM" }).items.map((p) => p.name)).toEqual([
      "charmander",
      "charmeleon",
    ]);
  });

  it("matches multi-word queries against hyphenated names", () => {
    expect(searchPokemon(all, { query: "mr mime" }).items.map((p) => p.name)).toEqual(["mr-mime"]);
  });

  it("includes custom pokemon in results", () => {
    expect(searchPokemon(all, { query: "sparky" }).items[0]?.isCustom).toBe(true);
  });

  it("paginates the filtered results, not the full list", () => {
    const result = searchPokemon(all, { query: "char", page: 2, pageSize: 1 });
    expect(result.items.map((p) => p.name)).toEqual(["charmeleon"]);
    expect(result).toMatchObject({ page: 2, total: 2, totalPages: 2 });
  });

  it("returns an empty page when nothing matches", () => {
    expect(searchPokemon(all, { query: "zzz" })).toMatchObject({ items: [], total: 0, totalPages: 1 });
  });
});
