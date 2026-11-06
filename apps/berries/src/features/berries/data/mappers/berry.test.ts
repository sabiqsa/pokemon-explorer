import { describe, expect, it } from "vitest";
import type { ApiBerry, ApiItem } from "@/features/berries/data/api/pokeapi";
import {
  berrySpriteUrl,
  englishShortEffect,
  idFromResourceUrl,
  toBerryDetail,
  toBerrySummary,
  toFirmnessNames,
  toFlavors,
} from "./berry";

const flavor = (name: string, potency: number) => ({
  potency,
  flavor: { name, url: `https://pokeapi.co/api/v2/berry-flavor/${name}/` },
});

const cheri: ApiBerry = {
  id: 1,
  name: "cheri",
  growth_time: 3,
  max_harvest: 5,
  natural_gift_power: 60,
  size: 20,
  firmness: { name: "soft", url: "" },
  flavors: [flavor("sour", 0), flavor("spicy", 10), flavor("dry", 0), flavor("sweet", 0), flavor("bitter", 0)],
  item: { name: "cheri-berry", url: "https://pokeapi.co/api/v2/item/126/" },
  natural_gift_type: { name: "fire", url: "" },
};

const cheriItem: ApiItem = {
  name: "cheri-berry",
  effect_entries: [
    { short_effect: "Tenu: soigne la paralysie.", effect: "", language: { name: "fr", url: "" } },
    { short_effect: "Held: Consumed when\nparalyzed to cure paralysis.", effect: "", language: { name: "en", url: "" } },
  ],
};

describe("idFromResourceUrl", () => {
  it("reads the trailing numeric ID, with or without a trailing slash", () => {
    expect(idFromResourceUrl("https://pokeapi.co/api/v2/berry/1/")).toBe("1");
    expect(idFromResourceUrl("https://pokeapi.co/api/v2/berry/68")).toBe("68");
  });

  it("throws when the URL has no ID", () => {
    expect(() => idFromResourceUrl("https://pokeapi.co/api/v2/berry/")).toThrow();
  });
});

describe("berrySpriteUrl", () => {
  it("builds the item sprite from the berry name", () => {
    expect(berrySpriteUrl("cheri")).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cheri-berry.png",
    );
  });
});

describe("toBerrySummary", () => {
  it("builds a card from the list entry alone (no per-berry fetch)", () => {
    expect(toBerrySummary({ name: "cheri", url: "https://pokeapi.co/api/v2/berry/1/" })).toEqual({
      id: "1",
      name: "cheri",
      imageUrl: berrySpriteUrl("cheri"),
      isCustom: false,
    });
  });
});

describe("toFlavors", () => {
  it("returns all five flavors in a fixed order", () => {
    expect(toFlavors(cheri.flavors)).toEqual([
      { name: "spicy", potency: 10 },
      { name: "dry", potency: 0 },
      { name: "sweet", potency: 0 },
      { name: "bitter", potency: 0 },
      { name: "sour", potency: 0 },
    ]);
  });

  it("stays empty when PokéAPI has no flavor data", () => {
    expect(toFlavors([])).toEqual([]);
  });

  it("fills a missing flavor with 0 and ignores unknown ones", () => {
    const flavors = toFlavors([flavor("spicy", 10), flavor("umami", 99)]);
    expect(flavors).toHaveLength(5);
    expect(flavors.find((f) => f.name === "sour")?.potency).toBe(0);
  });
});

describe("englishShortEffect", () => {
  it("picks the English entry and collapses line breaks", () => {
    expect(englishShortEffect(cheriItem)).toBe("Held: Consumed when paralyzed to cure paralysis.");
  });

  it("returns null without an item or an English entry", () => {
    expect(englishShortEffect(null)).toBeNull();
    expect(englishShortEffect({ ...cheriItem, effect_entries: [cheriItem.effect_entries[0]] })).toBeNull();
  });
});

describe("toBerryDetail", () => {
  it("combines the berry and its item", () => {
    expect(toBerryDetail(cheri, cheriItem)).toMatchObject({
      id: "1",
      name: "cheri",
      firmness: "soft",
      sizeMm: 20,
      growthTimeHours: 3,
      maxHarvest: 5,
      naturalGiftType: "fire",
      naturalGiftPower: 60,
      effect: "Held: Consumed when paralyzed to cure paralysis.",
      isCustom: false,
    });
  });

  it("keeps PokéAPI's missing data as null (the UI shows a dash)", () => {
    const sparse: ApiBerry = {
      ...cheri,
      size: null,
      growth_time: null,
      max_harvest: null,
      natural_gift_power: null,
      firmness: null,
      flavors: [],
      natural_gift_type: null,
    };
    expect(toBerryDetail(sparse, null)).toMatchObject({
      firmness: null,
      flavors: [],
      sizeMm: null,
      growthTimeHours: null,
      maxHarvest: null,
      naturalGiftType: null,
      naturalGiftPower: null,
      effect: null,
    });
  });

  it("keeps natural gift power even without a type (as PokéAPI has it for hopo)", () => {
    const hopoLike = { ...cheri, natural_gift_type: null, natural_gift_power: 17 };
    expect(toBerryDetail(hopoLike, cheriItem)).toMatchObject({ naturalGiftType: null, naturalGiftPower: 17 });
  });
});

describe("toFirmnessNames", () => {
  it("lists firmness names in API order", () => {
    const list = { results: ["very-soft", "soft"].map((name) => ({ name, url: "" })) };
    expect(toFirmnessNames(list)).toEqual(["very-soft", "soft"]);
  });
});
