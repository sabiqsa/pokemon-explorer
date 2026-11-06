import { describe, expect, it } from "vitest";
import { validateNewPokemon, type RawNewPokemon } from "./validate";

const validTypes = ["fire", "water", "electric"];
const context = { validTypes, isNameTaken: (name: string) => name === "pikachu" };

const valid: RawNewPokemon = {
  name: "Sparky-Mon",
  types: ["electric"],
  abilities: "Static, lightning rod, static",
  stats: {
    hp: "50",
    attack: "60",
    defense: "40",
    "special-attack": "70",
    "special-defense": "45",
    speed: "90",
  },
};

describe("validateNewPokemon", () => {
  it("accepts valid input and normalizes name and abilities", () => {
    const result = validateNewPokemon(valid, context);
    expect(result).toEqual({
      ok: true,
      value: {
        name: "sparky-mon",
        types: ["electric"],
        abilities: ["static", "lightning-rod"],
        stats: [
          { name: "hp", value: 50 },
          { name: "attack", value: 60 },
          { name: "defense", value: 40 },
          { name: "special-attack", value: 70 },
          { name: "special-defense", value: 45 },
          { name: "speed", value: 90 },
        ],
      },
    });
  });

  it.each([
    ["", "Name is required."],
    ["has space", "Use lowercase letters, numbers and single hyphens only."],
    ["double--hyphen", "Use lowercase letters, numbers and single hyphens only."],
    ["a".repeat(31), "Name must be at most 30 characters."],
    ["Pikachu", "A pokemon with this name already exists."],
  ])("rejects name %j", (name, message) => {
    const result = validateNewPokemon({ ...valid, name }, context);
    expect(result).toEqual({ ok: false, errors: { name: message } });
  });

  it("requires one or two known types", () => {
    expect(validateNewPokemon({ ...valid, types: [] }, context)).toMatchObject({ errors: { types: expect.any(String) } });
    expect(validateNewPokemon({ ...valid, types: ["fire", "water", "electric"] }, context)).toMatchObject({
      errors: { types: "Pick at most 2 types." },
    });
    expect(validateNewPokemon({ ...valid, types: ["cosmic"] }, context)).toMatchObject({
      errors: { types: "Unknown type selected." },
    });
  });

  it("treats a duplicated type as one", () => {
    const result = validateNewPokemon({ ...valid, types: ["fire", "fire"] }, context);
    expect(result.ok && result.value.types).toEqual(["fire"]);
  });

  it("requires at least one ability", () => {
    expect(validateNewPokemon({ ...valid, abilities: " , " }, context)).toMatchObject({
      errors: { abilities: expect.any(String) },
    });
  });

  it.each(["0", "256", "1.5", "", "abc"])("rejects stat value %j", (hp) => {
    const result = validateNewPokemon({ ...valid, stats: { ...valid.stats, hp } }, context);
    expect(result).toMatchObject({ ok: false, errors: { hp: expect.any(String) } });
  });
});
