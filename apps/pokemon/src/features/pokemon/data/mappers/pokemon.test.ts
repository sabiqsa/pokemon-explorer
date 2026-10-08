import { describe, expect, it } from "vitest";
import type { ApiPokemon } from "@/features/pokemon/data/api/pokeapi";
import { artworkUrl, idFromResourceUrl, toPokemonDetail, toPokemonSummary, toTypeNames } from "./pokemon";

const pikachu: ApiPokemon = {
  id: 25,
  name: "pikachu",
  types: [{ slot: 1, type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" } }],
  abilities: [
    { slot: 3, is_hidden: true, ability: { name: "lightning-rod", url: "https://pokeapi.co/api/v2/ability/31/" } },
    { slot: 1, is_hidden: false, ability: { name: "static", url: "https://pokeapi.co/api/v2/ability/9/" } },
  ],
  stats: [
    { base_stat: 35, stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" } },
    { base_stat: 90, stat: { name: "speed", url: "https://pokeapi.co/api/v2/stat/6/" } },
  ],
  sprites: {
    front_default: "front.png",
    other: { "official-artwork": { front_default: "artwork.png" } },
  },
};

describe("idFromResourceUrl", () => {
  it("reads the trailing numeric ID, with or without a trailing slash", () => {
    expect(idFromResourceUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe("25");
    expect(idFromResourceUrl("https://pokeapi.co/api/v2/pokemon/10326")).toBe("10326");
  });

  it("throws when the URL has no ID", () => {
    expect(() => idFromResourceUrl("https://pokeapi.co/api/v2/pokemon/")).toThrow();
  });
});

describe("toPokemonSummary", () => {
  it("builds the image from the ID instead of fetching detail", () => {
    expect(toPokemonSummary({ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" })).toEqual({
      id: "25",
      name: "pikachu",
      imageUrl: artworkUrl("25"),
      isCustom: false,
    });
  });
});

describe("toPokemonDetail", () => {
  it("maps types, abilities (by slot) and stats", () => {
    expect(toPokemonDetail(pikachu)).toEqual({
      id: "25",
      name: "pikachu",
      imageUrl: "artwork.png",
      isCustom: false,
      types: ["electric"],
      abilities: ["static", "lightning-rod"],
      stats: [
        { name: "hp", value: 35 },
        { name: "speed", value: 90 },
      ],
    });
  });

  it("falls back to the front sprite when there is no artwork", () => {
    const noArtwork = { ...pikachu, sprites: { front_default: "front.png" } };
    expect(toPokemonDetail(noArtwork).imageUrl).toBe("front.png");
  });

  it("drops stats outside the six main ones", () => {
    const extra = {
      ...pikachu,
      stats: [...pikachu.stats, { base_stat: 1, stat: { name: "accuracy", url: "" } }],
    };
    expect(toPokemonDetail(extra).stats.map((s) => s.name)).toEqual(["hp", "speed"]);
  });
});

describe("toTypeNames", () => {
  it("removes types no pokemon can have", () => {
    const list = { results: ["fire", "unknown", "water", "stellar"].map((name) => ({ name, url: "" })) };
    expect(toTypeNames(list)).toEqual(["fire", "water"]);
  });
});
