import { describe, expect, it } from "vitest";
import { validateNewBerry, type RawNewBerry } from "./validate";

const context = {
  validFirmnesses: ["very-soft", "soft", "hard"],
  isNameTaken: (name: string) => name === "cheri",
};

const valid: RawNewBerry = {
  name: "Moonglow Berry",
  firmness: "soft",
  flavors: { spicy: "0", dry: "10", sweet: "25", bitter: "0", sour: "0" },
  sizeMm: "40",
  growthTimeHours: "12",
  maxHarvest: "5",
  effect: "  Restores   10 HP.  ",
};

describe("validateNewBerry", () => {
  it("accepts valid input and normalizes name and effect", () => {
    expect(validateNewBerry(valid, context)).toEqual({
      ok: true,
      value: {
        name: "moonglow",
        firmness: "soft",
        flavors: [
          { name: "spicy", potency: 0 },
          { name: "dry", potency: 10 },
          { name: "sweet", potency: 25 },
          { name: "bitter", potency: 0 },
          { name: "sour", potency: 0 },
        ],
        sizeMm: 40,
        growthTimeHours: 12,
        maxHarvest: 5,
        effect: "Restores 10 HP.",
      },
    });
  });

  it("stores an empty effect as null", () => {
    const result = validateNewBerry({ ...valid, effect: "   " }, context);
    expect(result.ok && result.value.effect).toBeNull();
  });

  it.each([
    ["", "Name is required."],
    ["Berry", "Name is required."],
    ["a", "Name must be 2 to 30 characters."],
    ["a".repeat(31), "Name must be 2 to 30 characters."],
    ["bad_name!", "Use letters, numbers and single hyphens only."],
    ["Cheri Berry", "A berry with this name already exists."],
  ])("rejects name %j", (name, message) => {
    expect(validateNewBerry({ ...valid, name }, context)).toEqual({ ok: false, errors: { name: message } });
  });

  it("requires a known firmness", () => {
    expect(validateNewBerry({ ...valid, firmness: "" }, context)).toMatchObject({
      errors: { firmness: "Pick a firmness." },
    });
    expect(validateNewBerry({ ...valid, firmness: "squishy" }, context)).toMatchObject({
      errors: { firmness: "Unknown firmness selected." },
    });
  });

  it.each(["-1", "41", "2.5", "", "abc"])("rejects flavor potency %j", (sweet) => {
    const result = validateNewBerry({ ...valid, flavors: { ...valid.flavors, sweet } }, context);
    expect(result).toMatchObject({ ok: false, errors: { sweet: expect.any(String) } });
  });

  it("requires at least one flavor above 0", () => {
    const flavors = { spicy: "0", dry: "0", sweet: "0", bitter: "0", sour: "0" };
    expect(validateNewBerry({ ...valid, flavors }, context)).toEqual({
      ok: false,
      errors: { flavors: "Give at least one flavor a potency above 0." },
    });
  });

  it.each([
    ["sizeMm", "0"],
    ["sizeMm", "301"],
    ["growthTimeHours", "0"],
    ["growthTimeHours", "73"],
    ["maxHarvest", "0"],
    ["maxHarvest", "51"],
  ] as const)("rejects %s = %j", (field, value) => {
    const result = validateNewBerry({ ...valid, [field]: value }, context);
    expect(result).toMatchObject({ ok: false, errors: { [field]: expect.any(String) } });
  });

  it("limits the effect length", () => {
    expect(validateNewBerry({ ...valid, effect: "x".repeat(201) }, context)).toMatchObject({
      errors: { effect: expect.any(String) },
    });
  });
});
